import { Wallet } from "@solana/wallet-adapter-react";
import { AddressLookupTableProgram, Connection, PublicKey, Transaction } from "@solana/web3.js";

export const getLocalLuts = (): string[] => JSON.parse(localStorage.getItem("luts") || '[]')

export const appendLocalLut = (lut: string) => {
    const luts = getLocalLuts()
    luts.push(lut)
    localStorage.setItem("luts", JSON.stringify(luts))
}

const chunkArray = <T>(arr: T[], len: number) => {
    const chunks: T[][] = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}


export const createLut = async (
    connection: Connection,
    latestBlockHash: Awaited<ReturnType<typeof connection.getLatestBlockhash>>,
    wallet: Wallet,
    keysWithoutLut: string[],
    chunkSize: number
) => {
    const chunkedKeys = chunkArray(keysWithoutLut, chunkSize);
    const slot = await connection.getSlot();

    const [lookupTableIx, lookupTableAddress] =
        AddressLookupTableProgram.createLookupTable({
            authority: wallet.adapter.publicKey!,
            payer: wallet.adapter.publicKey!,
            recentSlot: slot,
        });

    let i = 0;
    while (chunkedKeys[i]) {
        const chunk = chunkedKeys[i];

        const tx = new Transaction();
        if (i === 0) {
            // First time should include the create
            tx.add(lookupTableIx)
        }

        const extendInstruction = AddressLookupTableProgram.extendLookupTable({
            payer: wallet.adapter.publicKey!,
            authority: wallet.adapter.publicKey!,
            lookupTable: lookupTableAddress,
            addresses: chunk.map(address => new PublicKey(address)),
        });

        tx.add(extendInstruction)

        const txResult = await wallet.adapter.sendTransaction(tx, connection);
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txResult,
        });

        i += 1
        await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Put LUT in localstorage and return the Lut as a LUT
    appendLocalLut(lookupTableAddress.toString())

    return lookupTableAddress
}