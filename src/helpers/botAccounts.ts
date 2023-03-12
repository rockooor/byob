import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { InitializedAction } from "../actions/types";
import { createSignature } from "./signMessage";
import { Token } from "./token";
import { serializeTransaction } from "./transaction";

export type BotOptions = {
    botAccount?: string;

    frequencyTimes?: number;
    frequencyInterval?: string;

    filterType?: string;
    filterToken?: Token;
    filterOperator?: string;
    filterValue?: number;

    name?: string
}

export const getLocalBotAccounts = (): { publicKey: string }[] => JSON.parse(localStorage.getItem("botAccounts") || '[]')

export const getLocalStorageBotAccounts = () => {
    return getLocalBotAccounts().map((botAccount) => {
        try {
            return { publicKey: new PublicKey(botAccount.publicKey) }
        } catch (e) {
            // do nothing
        }
        return undefined
    }).filter((x): x is { publicKey: PublicKey } => !!x)
}

export const appendLocalBotAccount = (botAccount: { publicKey: string }) => {
    const botAccounts = getLocalBotAccounts()
    botAccounts.push(botAccount)
    localStorage.setItem("botAccounts", JSON.stringify(botAccounts))
}

export const setLocalBotAccounts = (botAccounts: { publicKey: string }[]) => {
    localStorage.setItem("botAccounts", JSON.stringify(botAccounts))
}

export const createBotAccount = async (
    connection: Connection,
    anchorWallet: AnchorWallet,
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined,
    actions: InitializedAction[],
    botOptions: BotOptions,
    setError: Function
) => {
    console.log(botOptions)
    if (
        !botOptions.botAccount
        || !botOptions.frequencyTimes
        || !botOptions.frequencyInterval
        || !botOptions.filterType
        || !botOptions.filterToken
        || !botOptions.filterOperator
        || !botOptions.filterValue
        || !botOptions.name
    ) {
        return setError('Please fill out all fields')
    }

    setError('')

    const serializedTransaction = serializeTransaction(actions)

    // Sign the message
    const useLedger = localStorage.getItem("useLedger") === "true"


    const requestBody = {
        ledger: useLedger,
        ownerPublicKey: anchorWallet?.publicKey.toString(),
        signature: await createSignature(connection, anchorWallet!, signMessage, 'Create bot workflow'),

        name: botOptions.name,
        workflow: JSON.stringify(serializedTransaction),
        botKey: botOptions.botAccount,
        frequencyTimes: botOptions.frequencyTimes,
        frequencyInterval: botOptions.frequencyInterval,
        filterType: botOptions.filterType,
        filterToken: JSON.stringify(botOptions.filterToken),
        filterOperator: botOptions.filterOperator,
        filterValue: botOptions.filterValue,
    }
    
    const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/botworkflow/create`, {
        body: JSON.stringify(requestBody),
        method: 'POST'
    })
    const result = await resultRaw.json()
    console.log(result)

    return true;
}
