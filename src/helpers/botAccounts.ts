import { PublicKey } from "@solana/web3.js";

export const getLocalBotAccounts = (): { publicKey: string }[] => JSON.parse(localStorage.getItem("botAccounts") || '[]')

export const getLocalStorageBotAccounts = async () => {
    return (await Promise.all(getLocalBotAccounts().map(async (botAccount) => {
        try {
            return { publicKey: new PublicKey(botAccount.publicKey) }
        } catch (e) {
            // do nothing
        }
        return undefined
    }))).filter((x): x is { publicKey: PublicKey } => !!x)
}

export const appendLocalBotAccount = (botAccount: { publicKey: string }) => {
    const botAccounts = getLocalBotAccounts()
    botAccounts.push(botAccount)
    localStorage.setItem("botAccounts", JSON.stringify(botAccounts))
}

export const setLocalBotAccounts = (botAccounts: { publicKey: string }[]) => {
    localStorage.setItem("botAccounts", JSON.stringify(botAccounts))
}
