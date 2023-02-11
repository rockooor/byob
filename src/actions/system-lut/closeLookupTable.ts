import create from 'zustand/vanilla';
import { AddressLookupTableProgram, Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';

interface State extends BaseState {
    tokenAccount: string;
}

/**
 *
 * @param program
 * @param amountToMint Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const tx = async (anchorWallet: AnchorWallet, tokenAccount: string) => {
    return AddressLookupTableProgram.closeLookupTable({
        lookupTable: new PublicKey(tokenAccount),
        authority: anchorWallet.publicKey,
        recipient: anchorWallet.publicKey,
    })
};

const props = {
    protocol: {
        name: 'System / LUT',
        site: 'https://www.solana.com'
    },
    name: 'Close lookup table',
    description: 'Close a lookup table. When you want to close a LUT, first deactivate it, wait for 500 blocks and then close it. Therefore this cannot be done in 1 atomic transaction.'
};
export const closeLookupTable = (): Action => {
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
                        name: 'LUT address',
                        type: ActionType.STRING
                    }
                ],
                createTx: async () => ({
                    cleanupTxs: [await tx(anchorWallet, state.getState().tokenAccount)]
                }),
                state,
            };
        }
    };
};
