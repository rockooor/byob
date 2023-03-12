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
