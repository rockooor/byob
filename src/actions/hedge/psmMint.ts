import create, { StoreApi } from 'zustand/vanilla';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { DecimalFromU128, IDL, psmMintUshInstruction, Vault } from 'hedge-web3';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { getATA, tokenMints } from '../../helpers/token';
import { protocol, TOKENS } from './_tokens';

const USDC_DECIMALS = 6;
const USH_DECIMALS = 9;

interface State extends BaseState {
    amountToMint: number;
    mintFee: number;

    outputs: NonNullable<BaseState['outputs']>;
}

/**
 *
 * @param program
 * @param amountToMint Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const mintTx = async (connection:Connection, program: Program<Vault>, anchorWallet: AnchorWallet, amountToMint: number) => {
    return psmMintUshInstruction(
        // @ts-ignore
        program,
        anchorWallet.publicKey,
        TOKENS.psmMintAddress,
        new PublicKey(tokenMints.USDC),
        new BN(amountToMint),
        TOKENS.referralStatePublicKey,
        TOKENS.referralAccountPublicKey
    );
};

const props = {
    protocol,
    name: 'PSM Mint',
    description: 'Mint USH from the PSM'
};

const setAccountInfo = async (program: Program<Vault>, state: StoreApi<State>) => {
    const psmAccount = await program.account.psmAccount.fetch(TOKENS.psmMintAddress)
    state.setState({ mintFee: DecimalFromU128(psmAccount.mintFee.toNumber()).toNumber() })
}

export const psmMint = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                amountToMint: 0,
                mintFee: 0,
                outputs: [{ name: '', value: 0 }]
            }));

            const provider = new AnchorProvider(connection, anchorWallet, {});
            const program = new Program(IDL, TOKENS.hedgeProgramAccount, provider);
            await setAccountInfo(program, state)

            state.subscribe((newState, prevState) => {
                if (newState.amountToMint !== prevState.amountToMint) {
                    state.setState({
                        outputs: [{
                            name: `Amount USH minted (${newState.mintFee * 100}% fee)`,
                            value: newState.amountToMint * (1 - newState.mintFee) / 10 ** USDC_DECIMALS,
                        }]
                    })
                }
            })

            return {
                inputs: [
                    {
                        set: (amountToMint: number) =>
                            state.setState({
                                amountToMint: amountToMint * 10 ** USDC_DECIMALS,
                            }),
                        defaultValue: () => state.getState().amountToMint / 10 ** USDC_DECIMALS,
                        name: 'Amount of USDC to use for mint',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: async () => ({
                    setupTxs: [
                        // Mint tx assumes owner has USH token account
                        (await getATA(connection, new PublicKey(tokenMints.USH), anchorWallet.publicKey)).createTx,
                    ],
                    mainTxs: [await mintTx(connection, program, anchorWallet, state.getState().amountToMint)]
                }),
                state,
            };
        }
    };
};
