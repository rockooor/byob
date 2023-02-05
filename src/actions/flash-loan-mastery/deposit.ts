import create from 'zustand/vanilla';
import { BN } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { v4 } from 'uuid';
import { getATA } from '../../helpers/token';
import { deposit } from 'flash-loan-mastery';
import { Action, ActionType, BaseState } from '../types';
import { PoolInfo, protocol, TOKENS } from './_tokens';
import { setUp } from './utils';

interface State extends BaseState {
    amount: number;
    pool: string;
}

const props = {
    protocol,
    name: 'Deposit',
    description: 'Deposit into flash loan pool'
};

export const depositIx = async (connection: Connection, anchorWallet: AnchorWallet, state: State) => {
    const pool = TOKENS.pools[state.pool] as PoolInfo;
    if (!pool) {
        throw 'Pool not found';
    }
    const tokenFromResult = await getATA(connection, pool.mint, anchorWallet.publicKey);
    const { program } = setUp(connection, anchorWallet);

    const result = await deposit({
        program,
        connection,
        depositor: anchorWallet.publicKey,
        mint: pool.mint,
        tokenFrom: tokenFromResult.ata,
        amount: new BN(state.amount * 10 ** pool.decimals)
    });

    return {
        mainTxs: result.instructions.map((it) => it.instruction)
    };
};

export const depositAction = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                amount: 0,
                pool: ''
            }));

            return {
                ...props,
                inputs: [
                    {
                        set: (pool: string) => state.setState({ pool }),
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
                        name: 'Amount to deposit',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: () => depositIx(connection, anchorWallet, state.getState()),
                state,
                id: v4()
            };
        }
    };
};
