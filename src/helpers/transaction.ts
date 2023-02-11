import { Wallet } from "@solana/wallet-adapter-react";
import { AddressLookupTableAccount, ComputeBudgetProgram, Connection, PublicKey, Signer, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { InitializedAction } from "../actions/types";
import { createLut, getLocalLuts } from "./lut";

const KEY_WITHOUT_LUT_LIMIT = 20;

const getKeysWithoutLuts = (txs: TransactionInstruction[], luts: AddressLookupTableAccount[]) => {
    const allLutKeys = luts.map(lut => lut.state.addresses.map(address => address.toString())).flat()
    const keys = txs
        .map(tx => tx.keys.map(key => {
            const pk = key.pubkey.toString();

            // Check if pk is in a lut
            return allLutKeys.includes(pk) ? undefined : pk
        }))
        .flat()
        .filter((key): key is string => !!key)

    return keys;
}

/**
 * Converts actions to transaction instructions and luts.
 * Also returns all keys not in a LUT so it could be created
 */
export const convertActionsToTransactions = async (
    actions: InitializedAction[],
    localStorageLuts: AddressLookupTableAccount[],
) => {
    const atasToCreate: string[] = [];
    const txs: TransactionInstruction[] = [];
    const luts: AddressLookupTableAccount[] = localStorageLuts;
    const extraSigners: Signer[] = [];

    const createdTransactions = await Promise.all(
        actions.map(async (action) => ({ action, output: await action.createTx() }))
    );

    // Add maximum compute budget transaction
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1400000
    });
    txs.push(modifyComputeUnits);

    // Fill transactions array, keeping an index into account because we might need the index for flashloans
    let txIndex = 1;
    let solendFlashloanBorrowIndex = 0;

    // Setup transactions
    for (let i = 0; i < createdTransactions.length; i += 1) {
        const transaction = createdTransactions[i];
        if (!transaction.output.setupTxs) {
            continue
        }

        for (let j = 0; j < transaction.output.setupTxs.length; j += 1) {
            const tx = transaction.output.setupTxs[j]
            if (!tx) continue;
            else if (typeof tx === 'function') {
                txIndex += 1;
                txs.push(tx());
            } else {
                if ('ata' in tx) {
                    if (!atasToCreate.includes(tx.ata)) {
                        txIndex += 1;
                        atasToCreate.push(tx.ata)
                        txs.push(tx.ix)
                    }
                } else {
                    txIndex += 1;
                    txs.push(tx);
                }
            }
        }
    }

    // Main transactions
    for (let i = 0; i < createdTransactions.length; i += 1) {
        const transaction = createdTransactions[i];
        if (!transaction.output.mainTxs) {
            continue
        }

        if (transaction.action.protocol.name === 'Solend' && transaction.action.name === 'Flashloan') {
            solendFlashloanBorrowIndex = txIndex
        }

        for (let j = 0; j < transaction.output.mainTxs.length; j += 1) {
            const tx = transaction.output.mainTxs[j]
            if (!tx) continue;
            else if (typeof tx === 'function') {
                txIndex += 1;
                txs.push(tx());
            } else {
                txIndex += 1;
                txs.push(tx);
            }
        }
    }

    // Cleanup transactions
    for (let i = 0; i < createdTransactions.length; i += 1) {
        const transaction = createdTransactions[i];
        if (!transaction.output.cleanupTxs) {
            continue
        }

        for (let j = 0; j < transaction.output.cleanupTxs.length; j += 1) {
            const tx = transaction.output.cleanupTxs[j]
            if (!tx) continue;
            else if (typeof tx === 'function') {
                txIndex += 1;
                if (transaction.action.protocol.name === 'Solend' && transaction.action.name === 'Flashloan') {
                    txs.push(tx(solendFlashloanBorrowIndex));
                } else {
                    txs.push(tx());
                }
            } else {
                txIndex += 1;
                txs.push(tx);
            }
        }
    }

    luts.push(
        ...createdTransactions
            .map(({ output }) => (output.lutAccounts || []).filter((lut): lut is AddressLookupTableAccount => !!lut))
            .flat()
    );

    extraSigners.push(
        ...createdTransactions
            .map(({ output }) => (output.extraSigners || []).filter((signer): signer is Signer => !!signer))
            .flat()
    );

    const keysWithoutLut = getKeysWithoutLuts(txs, luts)

    return { txs, luts, keysWithoutLut, extraSigners }
}

export const executeTransaction = async (
    connection: Connection,
    wallet: Wallet,
    actions: InitializedAction[],
    setErrorLogs: React.Dispatch<React.SetStateAction<string[]>>,
    setTransactionModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    addTransactionMessage: (message: string) => void,
    resetTransactionMessages: () => void,
    setSentTxId: (txId: string) => void
) => {
    resetTransactionMessages()
    setTransactionModalOpen(true)
    addTransactionMessage('Building transaction...')
    const latestBlockhash = await connection.getLatestBlockhash('finalized');

    // Get localStorage luts
    const localStorageLuts = (await Promise.all(getLocalLuts().map(async (lut) => {
        try {
            return connection.getAddressLookupTable(new PublicKey(lut)).then((res) => res.value)
        } catch (e) {
            // do nothing
        }
        return undefined
    }))).filter((x): x is AddressLookupTableAccount => !!x)

    const { txs, luts, keysWithoutLut, extraSigners } = await convertActionsToTransactions(actions, localStorageLuts);

    if (keysWithoutLut.length > KEY_WITHOUT_LUT_LIMIT) {
        const chunkSize = 20;
        // Update transaction modal that a LUT tx is needed
        addTransactionMessage(`Need to create a new lookup table (LUT) account to reduce transaction size. `
            + `${keysWithoutLut.length} keys will be mapped in the LUT, which will take ${Math.ceil(keysWithoutLut.length / chunkSize)} transactions. `
            + `The required SOL remains yours and can be reclaimed by first disabling the LUT account, waiting 500 blocks (10 minutes or so) and `
            + `then closing the account. Both actions can be found under System > LUT. Additionally, the LUT is saved in localStorage for future access.`
        )
        // Create LUT now
        const extraLutAddress = await createLut(connection, latestBlockhash, wallet, keysWithoutLut, chunkSize)

        addTransactionMessage("Waiting five seconds to put some blocks between LUT activation and your transaction. Sometimes it gives an error when you are too fast")
        await new Promise(resolve => setTimeout(resolve, 5000))

        const extraLut = await connection.getAddressLookupTable(extraLutAddress).then((res) => res.value)
        luts.push(extraLut!)
    }

    addTransactionMessage('Simulating transaction...')

    const messageV0 = new TransactionMessage({
        payerKey: wallet.adapter.publicKey!,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: txs
    }).compileToV0Message(luts);
    const transaction = new VersionedTransaction(messageV0);

    if (extraSigners) {
        transaction.sign(extraSigners)
    }

    const simulate = await connection.simulateTransaction(transaction);


    if (simulate.value.err && simulate.value.logs) {
        resetTransactionMessages()
        setTransactionModalOpen(false)
        return setErrorLogs(simulate.value.logs.reverse())
    }

    addTransactionMessage('Transaction simulation successful. Sending transaction, please sign the transaction in your wallet')

    setErrorLogs([])
    try {
        const tx = await wallet.adapter.sendTransaction(transaction, connection);
        setSentTxId(tx);
    } catch (e) {
        setErrorLogs([e.message])
        setTransactionModalOpen(false)
    }
};

export const shareTransaction = async (
    actions: InitializedAction[],
    setTransactionModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    addTransactionMessage: (message: string) => void,
    resetTransactionMessages: () => void,
    setShareLink: (link: string) => void
) => {
    resetTransactionMessages()
    setTransactionModalOpen(true)
    addTransactionMessage("Creating share link")
    const serializedTransaction = actions.map(action => {
        return {
            state: action.state.getState(),
            uid: action.uid,
        }
    });

    // Store the serializedTransaction in table
    const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/create-link`, {
        body: JSON.stringify({ data: JSON.stringify(serializedTransaction) }),
        method: 'POST'
    })
    const result = await resultRaw.json() as { hash: string }

    addTransactionMessage("Share link created!")
    setShareLink(`${process.env.BASE_URL}/app/${result.hash}`)
}
