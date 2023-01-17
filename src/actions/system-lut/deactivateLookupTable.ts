import create from 'zustand/vanilla';
import { v4 } from 'uuid';
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
    return AddressLookupTableProgram.deactivateLookupTable({
        lookupTable: new PublicKey(tokenAccount),
        authority: anchorWallet.publicKey,
    })
};

const props = {
    protocol: {
        name: 'System / LUT',
        site: 'https://www.solana.com'
    },
    name: 'Deactivate lookup table',
    description: 'Deactivate a lookup table. When you want to close a LUT, first deactivate it, wait for 500 blocks and then close it. Therefore this cannot be done in 1 atomic transaction.'
};
export const deactivateLookupTable = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                tokenAccount: '',
            }));

            return {
                ...props,
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
                id: v4()
            };
        }
    };
};
