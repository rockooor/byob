import { AnchorWallet } from '@solana/wallet-adapter-react';
import { AddressLookupTableAccount, Connection, PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';
import { Token } from '../helpers/token';

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

export type ActionInput = {
    set: (x: any) => void;
    defaultValue: () => Token | number | string | boolean | undefined;
    name: string;
    type: ActionType;
    values?: { name: string; value: string }[] | string; // string means it's a state thing
    boundTo?: string
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
        boundedInputs?: (string | undefined)[]
    }>;
}

export type ActionWithUid = Action & { uid: string };

export type InitializedAction = Awaited<ReturnType<Action['initialize']>> & {
    id: string;
    uid: string;

    protocol: Protocol;
    name: string;
    description: string;
};
