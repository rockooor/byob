import create from 'zustand/vanilla';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { createCloseAccountInstruction } from '@solana/spl-token';

interface State extends BaseState {
    tokenAccount: string;
}

/**
 *
 * @param program
 * @param amountToMint Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const closeAccountTx = async (anchorWallet: AnchorWallet, tokenAccount: string) => {
    return createCloseAccountInstruction(
        new PublicKey(tokenAccount),
        anchorWallet.publicKey,
        anchorWallet.publicKey,
    )
};

const props = {
    protocol: {
        name: 'System / SPL token',
        site: 'https://www.solana.com'
    },
    name: 'Close token account',
    description: 'Close a token account'
};
export const closeTokenAccount = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                tokenAccount: '',
            }));

            return {
                inputs: [
                    {
                        set: (tokenAccount: string) =>
                            state.setState({
                                tokenAccount,
                            }),
                        name: 'ATA address',
                        type: ActionType.STRING
                    }
                ],
                createTx: async () => ({
                    cleanupTxs: [await closeAccountTx(anchorWallet, state.getState().tokenAccount)]
                }),
                state,
            };
        }
    };
};
