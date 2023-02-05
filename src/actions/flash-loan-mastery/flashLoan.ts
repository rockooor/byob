import create from 'zustand/vanilla';
import { BN } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { v4 } from 'uuid';
import { getATA } from '../../helpers/token';
import { flashLoan } from 'flash-loan-mastery';
import { Action, ActionType, BaseState } from '../types';
import { PoolInfo, protocol, TOKENS } from './_tokens';
import { setUp } from './utils';

interface State extends BaseState {
    amount: number;
    pool: string;
}

const props = {
    protocol,
    name: 'Flash Loan',
    description: 'Create a flash loan'
};

export const flashLoanIx = async (connection: Connection, anchorWallet: AnchorWallet, state: State) => {
    const pool = TOKENS.pools[state.pool] as PoolInfo;
    if (!pool) {
        throw 'Pool not found';
    }
    const referralResult = await getATA(connection, pool.mint, TOKENS.referrer, true);
    const { program } = setUp(connection, anchorWallet);

    const result = await flashLoan({
        program,
        borrower: anchorWallet.publicKey,
        mint: pool.mint,
        referralTokenTo: referralResult.ata,
        amount: new BN(state.amount * 10 ** pool.decimals)
    });

    return {
        setupTxs: [referralResult.createTx],
        mainTxs: [result.borrow],
        cleanupTxs: [result.repay]
    };
};

export const flashLoanAction = (): Action => {
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
                        name: 'Amount to borrow',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: () => flashLoanIx(connection, anchorWallet, state.getState()),
                state,
                id: v4()
            };
        }
    };
};
