import { AnchorWallet } from '@solana/wallet-adapter-react';
import { AddressLookupTableAccount, Connection, PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';

export interface BaseState {
    outputs?: {
        name: string;
        value: string | number;
    }[];
}

export enum ActionType {
    MINT,
    NUMBER,
    STRING,
    DROPDOWN,
    CHECK
}

type ActionInput = {
    set: (x: any) => void;
    name: string;
    type: ActionType;
    values?: { name: string; value: string }[] | string; // string means it's a state thing
};

type CreateAtaInstruction = {
    ata: string;
    ix: TransactionInstruction
}

type CreateTxOutput = {
    setupTxs?: (CreateAtaInstruction | TransactionInstruction | ((x?: any) => TransactionInstruction) | undefined)[];
    mainTxs?: (TransactionInstruction | ((x?: any) => TransactionInstruction) | undefined)[];
    cleanupTxs?: (TransactionInstruction | ((x?: any) => TransactionInstruction) | undefined)[];
    lutAccounts?: AddressLookupTableAccount[];
    extraSigners?: Signer[];
};

type Protocol = {
    name: string;
    site: string;
};

export interface Action {
    protocol: Protocol;
    name: string;
    description: string;
    initialize: (
        c: Connection,
        w: AnchorWallet
    ) => Promise<{
        inputs: ActionInput[];
        createTx: () => Promise<CreateTxOutput>;
        state: typeof this.state;
    }>;
}

export type InitializedAction = Awaited<ReturnType<Action['initialize']>> & {
    id: string,

    protocol: Protocol;
    name: string;
    description: string;
};
