import create from 'zustand/vanilla';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState, InitializedAction } from '../types';
import { getATA, getToken, tokenMints } from '../../helpers/token';
import {
    flashBorrowReserveLiquidityInstruction,
    flashRepayReserveLiquidityInstruction,
    SolendMarket
} from '@solendprotocol/solend-sdk';
import { TOKENS } from './_tokens';

interface State extends BaseState {
    amountToBorrow: number;
    market: string;
    reserve: string;

    _possibleReservesForMarket: {
        name: string;
        value: string;
    }[];
}

const props = {
    protocol: {
        name: 'Solend',
        site: 'https://solend.fi/'
    },
    name: 'Flashloan',
    description: 'Create a flashloan'
};

const mintTx = async (connection: Connection, anchorWallet: AnchorWallet, state: State) => {
    const ata = await getATA(connection, new PublicKey(state.reserve), anchorWallet.publicKey);

    const market = await SolendMarket.initialize(connection, 'production', state.market);

    const reserve = market.reserves.find((reserve) => reserve.config.liquidityToken.mint === state.reserve);

    const token = await getToken(state.reserve);
    if (!token) {
        throw Error('Could not find token');
    }

    console.log(reserve);

    const borrowTx = flashBorrowReserveLiquidityInstruction(
        state.amountToBorrow * 10 ** token.decimals,
        new PublicKey(reserve!.config.liquidityAddress),
        ata.ata,
        new PublicKey(reserve!.config.address),
        new PublicKey(state.market),
        new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo')
    );

    const repayTx = (borrowTxId: number) =>
        flashRepayReserveLiquidityInstruction(
            state.amountToBorrow * 10 ** token.decimals,
            borrowTxId,
            ata.ata,
            new PublicKey(reserve!.config.liquidityAddress),
            new PublicKey(reserve!.config.liquidityFeeReceiverAddress),
            ata.ata,
            new PublicKey(reserve!.config.address),
            new PublicKey(state.market),
            anchorWallet.publicKey,
            new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo')
        );

    return {
        setupTxs: [ata.createTx],
        mainTxs: [borrowTx],
        cleanupTxs: [repayTx],
    }
};

export const flashloan = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                amountToBorrow: 0,
                market: '',
                reserve: '',

                _possibleReservesForMarket: []
            }));

            return {
                inputs: [
                    {
                        set: async (market: string) => {
                            state.setState({ market });

                            // Get markets and populate the reserve dropdown
                            const marketInfo = await SolendMarket.initialize(connection, 'production', market);

                            state.setState({
                                _possibleReservesForMarket: marketInfo.reserves
                                    // Filter wSOL because wrapping
                                    .filter((reserve) => reserve.config.liquidityToken.mint !== tokenMints.wSOL)
                                    .map((reserve) => ({
                                        name: reserve.config.liquidityToken.symbol,
                                        value: reserve.config.liquidityToken.mint
                                    }))
                            });
                        },
                        defaultValue: () => state.getState().market,
                        name: 'Lending market',
                        type: ActionType.DROPDOWN,
                        values: [
                            // {
                            //     name: 'Main pool',
                            //     value: TOKENS.markets.main
                            // },
                            {
                                name: 'Turbo SOL pool',
                                value: TOKENS.markets.turboSol
                            }
                        ]
                    },
                    {
                        set: (reserve: string) => {
                            state.setState({ reserve });
                        },
                        defaultValue: () => state.getState().reserve,
                        name: 'Reserve',
                        type: ActionType.DROPDOWN,
                        values: '_possibleReservesForMarket' // read values from state
                    },
                    {
                        set: (amountToBorrow: number) => state.setState({ amountToBorrow }),
                        defaultValue: () => state.getState().amountToBorrow,
                        name: 'Amount to borrow',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: () => mintTx(connection, anchorWallet, state.getState()),
                state,
            };
        }
    };
};
