import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { navigate } from "gatsby";
import { InitializedAction } from "../actions/types";
import { BotOptions } from "./botAccounts";
import { createSignature } from "./signMessage";
import { Token } from "./token";
import { serializeTransaction } from "./transaction";

export type BotWorkflow = {
    botWorkflow: string;

    frequencyTimes: number;
    frequencyInterval: string;

    filterType: string;
    filterToken: Token;
    filterOperator: string;
    filterValue: number;

    id: string
    name: string

    serializedTx: string

    nextExecutionTime: number;
    timestamp: number;
}

export const getLocalBotWorkflows = (): BotWorkflow[] => JSON.parse(localStorage.getItem("botWorkflows") || '[]')

export const getLocalStorageBotWorkflows = () => {
    return getLocalBotWorkflows().map((botWorkflow) => {
        try {
            return botWorkflow
        } catch (e) {
            // do nothing
        }
        return undefined
    }).filter((x): x is BotWorkflow => !!x)
}

export const appendLocalBotWorkflow = (botWorkflow: BotWorkflow) => {
    const botWorkflows = getLocalBotWorkflows()
    botWorkflows.push(botWorkflow)
    localStorage.setItem("botWorkflows", JSON.stringify(botWorkflows))
}

export const setLocalBotWorkflows = (botWorkflows: BotWorkflow[]) => {
    localStorage.setItem("botWorkflows", JSON.stringify(botWorkflows))
}

export const createBotWorkflow = async (
    connection: Connection,
    anchorWallet: AnchorWallet,
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined,
    actions: InitializedAction[],
    botOptions: BotOptions,
    setError: Function,
    setCreatingBotWorkflow: Function
) => {
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
    setCreatingBotWorkflow(true)

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

    appendLocalBotWorkflow(result.workflow)

    setCreatingBotWorkflow(false)
    navigate('/app/botaccounts/')

    return true;
}
