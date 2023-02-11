import create from 'zustand/vanilla';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { buildCreateVaultTransaction, getVaultTypeAccountPublicKey, IDL, Vault } from 'hedge-web3';
import { Connection } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { getATA, tokenMints } from '../../helpers/token';
import { protocol, TOKENS } from './_tokens';

interface State extends BaseState {
    collateralType: string;
}

/**
 *
 * @param program
 * @param amountToDeposit Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const mintTx = async (connection: Connection, program: Program<Vault>, anchorWallet: AnchorWallet, state: State) => {
    const [createVaultTransaction, signers, _newVaultKey] = await buildCreateVaultTransaction(
        // @ts-ignore
        program,
        anchorWallet.publicKey,
        state.collateralType,
        0
    )

    return {
        mainTxs: createVaultTransaction.instructions,
        extraSigners: signers,
    }
};

const props = {
    protocol,
    name: 'Create vault',
    description: 'Create collateral to a vault'
};

export const createVault = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                collateralType: '',
            }));

            const provider = new AnchorProvider(connection, anchorWallet, {});
            const program = new Program(IDL, TOKENS.hedgeProgramAccount, provider);

            return {
                inputs: [
                    {
                        set: (collateralType: string) =>
                            state.setState({
                                collateralType,
                            }),
                        name: 'Collateral to deposit',
                        type: ActionType.DROPDOWN,
                        values: [
                            {
                                name: 'cUSDC',
                                value: 'CUSDC-105-025-I-'
                            },
                            {
                                name: 'SOL',
                                value: 'SOL-110-0-------'
                            }
                        ]
                    }
                ],
                createTx: async () => ({
                    ...await mintTx(connection, program, anchorWallet, state.getState())
                }),
                state,
            };
        }
    };
};
