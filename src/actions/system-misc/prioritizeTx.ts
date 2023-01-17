import create from 'zustand/vanilla';
import { v4 } from 'uuid';
import { ComputeBudgetProgram, Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { createCloseAccountInstruction } from '@solana/spl-token';

interface State extends BaseState {
    microLamports: number;
}

/**
 *
 * @param program
 * @param amountToMint Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const tx = async (anchorWallet: AnchorWallet, microLamports: number) => {
    return ComputeBudgetProgram.setComputeUnitPrice({
        microLamports,
    });
};

const props = {
    protocol: {
        name: 'System / Misc',
        site: 'https://www.solana.com'
    },
    name: 'Prioritize transaction',
    description: 'Add prioritization fee'
};
export const prioritizeTx = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                microLamports: 0,
            }));

            return {
                ...props,
                inputs: [
                    {
                        set: (microLamports: number) =>
                            state.setState({
                                microLamports,
                            }),
                        name: 'Microlamports',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: async () => ({
                    setupTxs: [await tx(anchorWallet, state.getState().microLamports)]
                }),
                state,
                id: v4()
            };
        }
    };
};
