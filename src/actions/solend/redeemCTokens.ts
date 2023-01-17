import create, { StoreApi } from 'zustand/vanilla';
import { v4 } from 'uuid';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { getATA, getToken, tokenMints } from '../../helpers/token';
import {
    SolendMarket,
    SolendAction,
    SolendReserve
} from '@solendprotocol/solend-sdk';
import { TOKENS } from './_tokens';
import { BN } from '@project-serum/anchor';

interface State extends BaseState {
    amountToDeposit: number;
    market: string;
    reserve: string;

    _possibleReservesForMarket: {
        name: string;
        value: string;
    }[];
    _reserve?: SolendReserve;
    _market?: SolendMarket;

    outputs: [{
        name: string;
        value: number;
    }]
}

const props = {
    protocol: {
        name: 'Solend',
        site: 'https://solend.fi/'
    },
    name: 'Redeem cTokens',
    description: 'Redeem cTokens from a particular pool for its underlying collateral.'
};

const redeemTx = async (connection: Connection, anchorWallet: AnchorWallet, state: State) => {
    const ata = await getATA(connection, new PublicKey(state.reserve), anchorWallet.publicKey);
    const reserve = state._reserve;

    const token = await getToken(state.reserve);
    if (!token || !reserve) {
        throw Error('Could not find token or reserve');
    }

    const reserveStats = reserve.stats;
    if (!reserveStats) {
        throw Error('Could not load reserve stats')
    }

    const txs = await SolendAction.buildRedeemReserveCollateralTxns(
        connection,
        new BN(state.amountToDeposit * 10 ** reserve.config.liquidityToken.decimals),
        reserve.config.liquidityToken.symbol!,
        anchorWallet.publicKey,
        'production',
        new PublicKey(state.market)
    )

    return {
        setupTxs: [ata.createTx, ...txs.preTxnIxs],
        mainTxs: [...txs.lendingIxs],
        cleanupTxs: [...txs.postTxnIxs, ...txs.cleanupIxs],
    }
};

export const redeemCTokens = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                amountToDeposit: 0,
                market: '',
                reserve: '',

                _possibleReservesForMarket: [],

                outputs: [{ name: 'Amount received', value: 0 }]
            }));

            return {
                ...props,
                inputs: [
                    {
                        set: async (market: string) => {
                            state.setState({ market });

                            // Get markets and populate the reserve dropdown
                            const marketInfo = await SolendMarket.initialize(connection, 'production', market);

                            state.setState({
                                _market: marketInfo,
                                _possibleReservesForMarket: marketInfo.reserves
                                    // Filter wSOL because wrapping
                                    .filter((reserve) => reserve.config.liquidityToken.mint !== tokenMints.wSOL)
                                    .map((reserve) => ({
                                        name: reserve.config.liquidityToken.symbol,
                                        value: reserve.config.liquidityToken.mint
                                    }))
                            });
                        },
                        name: 'Lending market',
                        type: ActionType.DROPDOWN,
                        values: [
                            {
                                name: 'Main pool',
                                value: TOKENS.markets.main
                            },
                            {
                                name: 'Turbo SOL pool',
                                value: TOKENS.markets.turboSol
                            }
                        ]
                    },
                    {
                        set: async (reserve: string) => {
                            const market = state.getState()._market;
                            if (!market) return

                            const _reserve = market.reserves.find((__reserve) => __reserve.config.liquidityToken.mint === reserve)
                            if (!_reserve) return
                            await _reserve.load();

                            state.setState({
                                reserve,
                                _reserve,
                            });
                        },
                        name: 'Reserve',
                        type: ActionType.DROPDOWN,
                        values: '_possibleReservesForMarket' // read values from state
                    },
                    {
                        set: async (amountToDeposit: number) => {
                            state.setState({ amountToDeposit });

                            // Update amount to redeem
                            const reserve = state.getState()._reserve;
                            if (!reserve) return
                            const reserveStats = reserve.stats;
                            if (!reserveStats) return
                            state.setState((state) => ({
                                outputs: [
                                    {
                                        name: state.outputs[0].name,
                                        value: state.amountToDeposit * 10 ** reserveStats.decimals * reserveStats.cTokenExchangeRate / (10 ** reserve.config.liquidityToken.decimals)
                                    }
                                ]
                            }));
                        },
                        name: 'Amount to redeem',
                        type: ActionType.NUMBER
                    }
                ],
                createTx: () => redeemTx(connection, anchorWallet, state.getState()),
                state,
                id: v4()
            };
        }
    };
};
