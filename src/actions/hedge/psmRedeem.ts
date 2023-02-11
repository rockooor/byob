import create, { StoreApi } from 'zustand/vanilla';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { DecimalFromU128, IDL, psmRedeemUshInstruction, Vault } from 'hedge-web3';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { protocol, TOKENS } from './_tokens';
import { tokenMints } from '../../helpers/token';

const USH_DECIMALS = 9;

interface State extends BaseState {
    amountToRedeem: number;
    redeemFee: number;

    outputs: NonNullable<BaseState['outputs']>;
}

/**
 *
 * @param program
 * @param amountToRedeem Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const redeemTx = async (program: Program<Vault>, anchorWallet: AnchorWallet, amountToRedeem: number) => {
    return psmRedeemUshInstruction(
        // @ts-ignore
        program,
        anchorWallet.publicKey,
        TOKENS.psmMintAddress,
        new PublicKey(tokenMints.USDC),
        new BN(amountToRedeem),
        TOKENS.referralStatePublicKey,
        TOKENS.referralAccountPublicKey
    );
};

const props = {
    protocol,
    name: 'PSM Redeem',
    description: 'Redeem USDC from the PSM'
};

const setAccountInfo = async (program: Program<Vault>, state: StoreApi<State>) => {
    const psmAccount = await program.account.psmAccount.fetch(TOKENS.psmMintAddress)
    state.setState({ redeemFee: DecimalFromU128(psmAccount.redeemFee.toNumber()).toNumber() })
}

export const psmRedeem = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const provider = new AnchorProvider(connection, anchorWallet, {});
            const program = new Program(IDL, TOKENS.hedgeProgramAccount, provider);

            const state = create<State>(() => ({
                amountToRedeem: 0,
                redeemFee: 0,
                outputs: []
            }));

            await setAccountInfo(program, state)

            state.setState({
                outputs: [{
                    name: `Amount USDC redeemed (${state.getState().redeemFee * 100}% fee)`,
                    value: 0,
                }]
            })

            return {
                inputs: [
                    {
                        set: (amountToRedeem: number) =>
                            state.setState({
                                amountToRedeem: amountToRedeem * 10 ** USH_DECIMALS,
                                outputs: [
                                    {
                                        name: state.getState().outputs[0].name,
                                        value: amountToRedeem * (1 - state.getState().redeemFee)
                                    }
                                ]
                            }),
                        defaultValue: () => state.getState().amountToRedeem,
                        name: 'Amount of USH to use for redeeming',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: async () => ({
                    mainTxs: await Promise.all([redeemTx(program, anchorWallet, state.getState().amountToRedeem)])
                }),
                state,
            };
        }
    };
};
