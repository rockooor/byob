import create, { StoreApi } from 'zustand/vanilla';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import {
    AddressLookupTableAccount,
    Connection,
    PublicKey,
    TransactionMessage,
    VersionedTransaction
} from '@solana/web3.js';
import { Action, ActionType, BaseState } from '../types';
import { debounce } from '../../helpers/debounce';
import { getATA, Token } from '../../helpers/token';

interface State extends BaseState {
    inputToken?: Token;
    outputToken?: Token;
    inputAmount: number;
    slippageBps: number;

    outputs: NonNullable<BaseState['outputs']>;
}

export const getBestRoute = async (currentState: State, setState: Function) => {
    if (!currentState.inputToken || !currentState.outputToken || !currentState.inputAmount) {
        return;
    }

    const inputAddress = currentState.inputToken.address;
    const outputAddress = currentState.outputToken.address;
    const inputAmount = Math.floor(currentState.inputAmount * 10 ** currentState.inputToken!.decimals);
    const slippageBps = currentState.slippageBps || 0;

    const { data } = await (
        await fetch(
            `https://quote-api.jup.ag/v4/quote?inputMint=${inputAddress}&outputMint=${outputAddress}&amount=${inputAmount}&slippageBps=${slippageBps}&feeBps=${process.env.JUPITER_SWAP_FEE_BPS}`
        )
    ).json();

    const bestRoute = data[0];
    setState((state) => ({
        outputs: [
            {
                name: state.outputs[0].name,
                value: bestRoute.outAmount * 10 ** -currentState.outputToken!.decimals
            }
        ]
    }));

    return bestRoute;
};

const getSwapTx = async (connection: Connection, wallet: AnchorWallet, state: StoreApi<State>) => {
    const bestRoute = await getBestRoute(state.getState(), state.setState);

    const referralResult = await getATA(
        connection,
        new PublicKey(state.getState().outputToken!.address),
        new PublicKey(process.env.BYOB_REFERRAL_ACCOUNT!),
        true,
        wallet.publicKey
    );

    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v4/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route: bestRoute,
                userPublicKey: wallet.publicKey.toString(),
                wrapUnwrapSOL: true,
                feeAccount: referralResult.ata,
                feeBps: process.env.JUPITER_SWAP_FEE_BPS!
            })
        })
    ).json();

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Decompile the transaction
    const addressLookupTableAccounts = await Promise.all(
        transaction.message.addressTableLookups.map(async (lookup) => {
            return new AddressLookupTableAccount({
                key: lookup.accountKey,
                state: AddressLookupTableAccount.deserialize(
                    await connection.getAccountInfo(lookup.accountKey).then((res) => res!.data)
                )
            });
        })
    );

    const message = TransactionMessage.decompile(transaction.message, { addressLookupTableAccounts });

    return {
        setupTxs: [referralResult.createTx],
        mainTxs: message.instructions.filter(
            (tx) => tx.programId.toString() !== 'ComputeBudget111111111111111111111111111111'
        ),
        lutAccounts: addressLookupTableAccounts
    };
};

const props = {
    protocol: {
        name: 'Jupiter',
        site: 'https://www.jup.ag'
    },
    name: 'Swap',
    description: 'Swap token A for B using Jupiter'
};

export const swap = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                inputAmount: 0,
                slippageBps: 0,

                outputs: [
                    {
                        name: 'Amount out',
                        value: 0
                    }
                ]
            }));

            state.subscribe((newState, prevState) => {
                // Call getBestRoute when something changed.
                // That function deals with undefined stuff etc.
                if (newState.inputToken !== prevState.inputToken
                    || newState.outputToken !== prevState.outputToken
                    || newState.inputAmount !== prevState.inputAmount
                    || newState.slippageBps !== prevState.slippageBps) {
                        getBestRoute(newState, state.setState)
                }
            })

            const debouncedGetBestRoute = debounce(() => getBestRoute(state.getState(), state.setState));

            return {
                inputs: [
                    {
                        name: 'Input token mint',
                        set: (mint: Token) => {
                            state.setState({ inputToken: mint });
                            debouncedGetBestRoute();
                        },
                        defaultValue: () => state.getState().inputToken,
                        type: ActionType.MINT
                    },
                    {
                        name: 'Output token mint',
                        set: (mint: Token) => {
                            state.setState({ outputToken: mint });
                            debouncedGetBestRoute();
                        },
                        defaultValue: () => state.getState().outputToken,
                        type: ActionType.MINT
                    },
                    {
                        name: 'Input amount',
                        set: async (inputAmount: number) => {
                            state.setState({ inputAmount });
                            debouncedGetBestRoute();
                        },
                        defaultValue: () => state.getState().inputAmount,
                        type: ActionType.NUMBER
                    },
                    {
                        name: 'Max slippage in bps',
                        set: (slippageBps: number) => {
                            state.setState({ slippageBps });
                            debouncedGetBestRoute();
                        },
                        defaultValue: () => state.getState().slippageBps,
                        type: ActionType.NUMBER
                    }
                ],
                createTx: async () => getSwapTx(connection, anchorWallet, state),
                state,
            };
        }
    };
};
