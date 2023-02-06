import { Connection } from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { getProgram } from 'flash-loan-mastery';
import { TOKENS } from './_tokens';

export const setUp = (connection: Connection, anchorWallet: AnchorWallet) => {
    const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
    const program = getProgram(TOKENS.programId, provider);
    return { program, provider };
};
