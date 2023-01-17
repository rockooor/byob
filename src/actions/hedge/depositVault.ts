import create from 'zustand/vanilla';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { v4 } from 'uuid';
import { CHAINLINK_PROGRAM_ID, createUserReferralAccountInstruction, depositVaultInstruction, findAssociatedTokenAddress, getHedgeMintPublicKey, getLinkedListAccounts, getPoolPublicKeyForMint, getReferralAccountPublicKey, getUserReferralAccountPublicKey, getUshMintPublicKey, getVaultSystemStatePublicKey, getVaultTypeOracleAccountPublicKey, IDL, loanVaultInstruction, repayVaultInstruction, Vault, withdrawVaultInstruction } from 'hedge-web3';
import { Connection, Keypair, PublicKey, Signer, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Action, ActionType, BaseState } from '../types';
import { protocol, TOKENS } from './_tokens';
import { getATA } from '../../helpers/token';

interface State extends BaseState {
    vaultAddress: string;
    amountToDeposit: number;
    amountToBorrow: number;
    amountToRepay: number;
    amountToWithdraw: number;
    redeem: boolean;
    liquidate: boolean;
}

/**
 *
 * @param program
 * @param amountToDeposit Amount of USH to mint in USDC minor amount (6 decimals)
 * @returns
 */
const mintTx = async (connection: Connection, program: Program<Vault>, anchorWallet: AnchorWallet, state: State) => {
    const mainTxs: TransactionInstruction[] = [];
    const extraSigners: Signer[] = [];
    const vault = await program.account.vault.fetch(state.vaultAddress)
    const vaultTypeAccountPublicKey = new PublicKey(vault.vaultType.toString());
    const vaultType = await program.account.vaultType.fetch(vaultTypeAccountPublicKey)
    
    const vaultSystemStatePublicKey = await getVaultSystemStatePublicKey(TOKENS.hedgeProgramAccount)
    const ushMintPublickey = await getUshMintPublicKey(TOKENS.hedgeProgramAccount)
    const hedgeMintPublickey = await getHedgeMintPublicKey(TOKENS.hedgeProgramAccount)
    const [hedgeStakingPoolPublicKey] = await getPoolPublicKeyForMint(
        TOKENS.hedgeProgramAccount,
        hedgeMintPublickey
    )
    const hedgeStakingPoolAssociatedUshTokenAccount = await findAssociatedTokenAddress(
        TOKENS.hedgeProgramAccount,
        hedgeStakingPoolPublicKey,
        ushMintPublickey
    )
    const payerTokenAccount = await findAssociatedTokenAddress(
        TOKENS.hedgeProgramAccount,
        anchorWallet.publicKey,
        vaultType.collateralMint
    )
    const vaultAssociatedCollateralAccountPublicKey = await findAssociatedTokenAddress(
        TOKENS.hedgeProgramAccount,
        new PublicKey(state.vaultAddress),
        vaultType.collateralMint
    )

    const vaultTypeAssociatedTokenAccount = await findAssociatedTokenAddress(
        TOKENS.hedgeProgramAccount,
        vaultTypeAccountPublicKey,
        vaultType.collateralMint
    )
    const vaultAssociatedTokenAccount = await findAssociatedTokenAddress(
        TOKENS.hedgeProgramAccount,
        new PublicKey(state.vaultAddress),
        vaultType.collateralMint
    )

    const userReferralAccountPublicKey = await getUserReferralAccountPublicKey(
        TOKENS.hedgeProgramAccount,
        anchorWallet.publicKey
    )

    const referralAccountPublicKey = await getReferralAccountPublicKey(
        TOKENS.hedgeProgramAccount,
        vaultSystemStatePublicKey
    )

    const vaultTypeOracleAccountPublicKey = await getVaultTypeOracleAccountPublicKey(
        TOKENS.hedgeProgramAccount,
        vaultType.vaultTypeName
    )
    const oracleAccountInfo = await program.account.oracleInfoForCollateralType.fetch(
        vaultTypeOracleAccountPublicKey
    )

    const userUSHAccount = await getATA(connection, ushMintPublickey, anchorWallet.publicKey)

    if (!(await program.provider.connection.getAccountInfo(userReferralAccountPublicKey))) {
        console.log('No user referral account found. Adding instruction to create it.', userReferralAccountPublicKey.toString())
        mainTxs.push(
            await createUserReferralAccountInstruction(
                // @ts-ignore
                program,
                anchorWallet.publicKey,
                referralAccountPublicKey,
                userReferralAccountPublicKey
            )
        )
    }
console.log(state)
    const [oldSmallerPublicKey, newSmallerPublicKey, newLargerPublicKey, cachedVaults] =
        await getLinkedListAccounts(
            // @ts-ignore
            program,
            vaultTypeAccountPublicKey,
            state.vaultAddress,
            new BN(state.amountToDeposit * 10 ** vaultType.collateralDecimals),
            new BN(state.amountToWithdraw * 10 ** vaultType.collateralDecimals),
            new BN(state.amountToBorrow * 10 ** 9),
            new BN(state.amountToRepay * 10 ** 9),
            // state.amountToRepay > 0 && state.amountToRepay === vault.,
            state.redeem,
            state.liquidate,
        )

    // Refresh oracle tx
    mainTxs.push(
        await program.methods
            .refreshOraclePrice(
                new BN(0), // override usd/sol price
                new BN(0) // override override time
            )
            .accounts({
                oracleInfoAccount: vaultTypeOracleAccountPublicKey,
                vaultTypeAccount: vaultTypeAccountPublicKey,
                oracleChainlink: oracleAccountInfo.oracleChainlink,
                oraclePyth: oracleAccountInfo.oraclePyth,
                oracleSwitchboard: oracleAccountInfo.oracleSwitchboard,
                systemProgram: SystemProgram.programId,
                chainlinkProgram: CHAINLINK_PROGRAM_ID,
            })
            .instruction() // or .rpc() or .simulate() etc.
    )

    if (state.amountToDeposit > 0) {
        const history = Keypair.generate()
        extraSigners.push(history)
        mainTxs.push(await depositVaultInstruction(
            // @ts-ignore
            program,
            vaultSystemStatePublicKey,
            anchorWallet.publicKey,
            payerTokenAccount,
            new PublicKey(state.vaultAddress),
            vaultAssociatedCollateralAccountPublicKey,
            history.publicKey,
            vaultTypeAccountPublicKey,
            vaultTypeAssociatedTokenAccount,
            hedgeStakingPoolPublicKey,
            hedgeStakingPoolAssociatedUshTokenAccount,
            vaultType.collateralMint,
            ushMintPublickey,
            oldSmallerPublicKey,
            newSmallerPublicKey,
            newLargerPublicKey,
            new BN(state.amountToDeposit * 10 ** vaultType.collateralDecimals)
        ))
    }

    if (state.amountToRepay > 0) {
        const history = Keypair.generate()
        extraSigners.push(history)
        mainTxs.push(await repayVaultInstruction(
            // @ts-ignore
            program,
            anchorWallet.publicKey,
            userUSHAccount.ata,
            new PublicKey(state.vaultAddress),
            vaultAssociatedTokenAccount,
            history.publicKey,
            vaultTypeAccountPublicKey,
            vaultTypeAssociatedTokenAccount,
            oldSmallerPublicKey,
            newSmallerPublicKey,
            newLargerPublicKey,
            new BN(state.amountToRepay * 10 ** 9)
        ))
    }

    if (state.amountToWithdraw > 0) {
        const history = Keypair.generate()
        extraSigners.push(history)

        mainTxs.push(await withdrawVaultInstruction(
            // @ts-ignore
            program,
            vaultSystemStatePublicKey,
            anchorWallet.publicKey,
            payerTokenAccount,
            new PublicKey(state.vaultAddress),
            vaultAssociatedCollateralAccountPublicKey,
            vaultTypeAccountPublicKey,
            vaultTypeAssociatedTokenAccount,
            hedgeStakingPoolPublicKey,
            hedgeStakingPoolAssociatedUshTokenAccount,
            ushMintPublickey,
            history.publicKey,
            oldSmallerPublicKey,
            newSmallerPublicKey,
            newLargerPublicKey,
            new BN(state.amountToWithdraw * 10 ** vaultType.collateralDecimals)
        ))
    }

    if (state.amountToBorrow > 0) {
        const history = Keypair.generate()
        extraSigners.push(history)

        mainTxs.push(await loanVaultInstruction(
            // @ts-ignore
            program,
            anchorWallet.publicKey,
            userUSHAccount.ata,
            new PublicKey(state.vaultAddress),
            vaultAssociatedTokenAccount,
            history.publicKey,
            vaultTypeAccountPublicKey,
            vaultTypeAssociatedTokenAccount,
            oldSmallerPublicKey,
            newSmallerPublicKey,
            newLargerPublicKey,
            new BN(state.amountToBorrow * 10 ** 9),
            referralAccountPublicKey
        ))
    }

    return {
        setupTxs: [],
        mainTxs,
        extraSigners,
    }
};

const props = {
    protocol,
    name: 'Interact with vault',
    description: 'Deposit, withdraw, borrow and/or repay from vault'
};

export const depositVault = (): Action => {
    return {
        ...props,
        initialize: async (connection: Connection, anchorWallet: AnchorWallet) => {
            const state = create<State>(() => ({
                vaultAddress: '',
                amountToDeposit: 0,
                amountToBorrow: 0,
                amountToRepay: 0,
                amountToWithdraw: 0,
                redeem: false,
                liquidate: false,
            }));

            const provider = new AnchorProvider(connection, anchorWallet, {});
            const program = new Program(IDL, TOKENS.hedgeProgramAccount, provider);

            return {
                ...props,
                inputs: [
                    {
                        set: (vaultAddress: string) =>
                            state.setState({
                                vaultAddress,
                            }),
                        name: 'Vault address',
                        type: ActionType.STRING,
                    },
                    {
                        set: (amountToDeposit: number) =>
                            state.setState({
                                amountToDeposit,
                            }),
                        name: 'Amount collateral to deposit',
                        type: ActionType.NUMBER
                    },
                    {
                        set: (amountToWithdraw: number) =>
                            state.setState({
                                amountToWithdraw,
                            }),
                        name: 'Amount collateral to withdraw',
                        type: ActionType.NUMBER
                    },
                    {
                        set: (amountToRepay: number) =>
                            state.setState({
                                amountToRepay,
                            }),
                        name: 'Amount USH to repay',
                        type: ActionType.NUMBER
                    },
                    {
                        set: (amountToBorrow: number) =>
                            state.setState({
                                amountToBorrow,
                            }),
                        name: 'Amount USH to borrow',
                        type: ActionType.NUMBER
                    },
                    {
                        set: (redeem: boolean) =>
                            state.setState({
                                redeem,
                            }),
                        name: 'Fully redeem (check if amount repay is equal to total debt)',
                        type: ActionType.CHECK
                    },
                    {
                        set: (liquidate: boolean) =>
                            state.setState({
                                liquidate,
                            }),
                        name: 'Fully liquidate (check if amount withdrawn is equal to total debt)',
                        type: ActionType.CHECK
                    },
                ],
                createTx: async () => ({
                    ...await mintTx(connection, program, anchorWallet, state.getState())
                }),
                state,
                id: v4()
            };
        }
    };
};
