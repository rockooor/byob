import { sign } from "tweetnacl"
import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js"
import bs58 from "bs58"
import { AnchorWallet } from "@solana/wallet-adapter-react"

const MEMO_PROGRAM_ID = new PublicKey(
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
)

const signLedger = async (
    connection: Connection,
    wallet: AnchorWallet,
    messageToSign: string
) => {
    const tx = new Transaction()
    tx.add(
        new TransactionInstruction({
            programId: MEMO_PROGRAM_ID,
            keys: [],
            data: Buffer.from(messageToSign, "utf8"),
        })
    )
    tx.feePayer = wallet.publicKey!

    const { blockhash } = await connection.getLatestBlockhash()
    tx.recentBlockhash = blockhash

    const signedTx = await wallet.signTransaction(tx)
    console.log(signedTx)
    console.log(signedTx.signatures?.[0].signature?.toString("hex"))
    return signedTx.serialize().toString("hex")
}

const signNative = async (
    publicKey: PublicKey | null,
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined,
    messageToSign: string
) => {
    // Sign the message
    if (!publicKey) throw new Error("Wallet not connected!")
    if (!signMessage) throw new Error("Wallet does not support message signing!")

    const message = new TextEncoder().encode(messageToSign)
    const signature = await signMessage(message)
    if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error("Invalid signature!")

    return bs58.encode(signature)
}

export const createSignature = async (
    connection: Connection,
    wallet: AnchorWallet,
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined,
    messageToSign: string
) => {
    const useLedger = localStorage.getItem("useLedger") === "true" ? true : false
    if (useLedger) {
        if (!wallet) throw new Error("Wallet is not defined")
        return signLedger(connection, wallet, messageToSign)
    }

    return signNative(wallet.publicKey, signMessage, messageToSign)
}
