import create from 'zustand/vanilla';
import { BN } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { getATA } from '../../helpers/token';
import { withdraw } from 'flash-loan-mastery';
import { Action, ActionType, BaseState } from '../types';
import { PoolInfo, protocol, TOKENS } from './_tokens';
import { setUp } from './utils';

interface State extends BaseState {
    amount: number;
    pool: string;
}

const props = {
    protocol,
    name: 'Withdraw',
    description: 'Withdraw from flash loan pool'
};

export const withdrawIx = async (connection: Connection, anchorWallet: AnchorWallet, state: State) => {
    const pool = TOKENS.pools[state.pool] as PoolInfo;
    if (!pool) {
        throw 'Pool not found';
    }
    const tokenFromResult = await getATA(connection, pool.poolShareMint, anchorWallet.publicKey);
    const { program } = setUp(connection, anchorWallet);

    const result = await withdraw({
        program,
        connection,
        withdrawer: anchorWallet.publicKey,
        mint: pool.mint,
        poolShareTokenFrom: tokenFromResult.ata,
        amount: new BN(state.amount * 10 ** pool.decimals)
    });

    return {
        mainTxs: result.instructions.map((it) => it.instruction)
    };
};

export const withdrawAction = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                amount: 0,
                pool: ''
            }));

            return {
                inputs: [
                    {
                        set: (pool: string) => state.setState({ pool }),
                        defaultValue: () => state.getState().pool,
                        name: 'Flash Loan Pool',
                        type: ActionType.DROPDOWN,
                        values: Object.keys(TOKENS.pools).map((it) => {
                            return {
                                name: it,
                                value: it
                            };
                        })
                    },
                    {
                        set: (amount: number) => state.setState({ amount }),
                        defaultValue: () => state.getState().amount,
                        name: 'Amount to withdraw',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: () => withdrawIx(connection, anchorWallet, state.getState()),
                state,
            };
        }
    };
};
