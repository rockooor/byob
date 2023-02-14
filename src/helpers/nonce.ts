import { Wallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, NonceAccount, NONCE_ACCOUNT_LENGTH, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const createNonceAccount = async (connection: Connection, wallet: Wallet) => {
    const nonceAccount = Keypair.generate();
    const latestBlockhash = await connection.getLatestBlockhash('finalized');

    const tx = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.adapter.publicKey!,
            newAccountPubkey: nonceAccount.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(
                NONCE_ACCOUNT_LENGTH
            ),
            space: NONCE_ACCOUNT_LENGTH,
            programId: SystemProgram.programId,
        }),
        SystemProgram.nonceInitialize({
            noncePubkey: nonceAccount.publicKey,
            authorizedPubkey: wallet.adapter.publicKey!,
        })
    );

    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = wallet.adapter.publicKey!
    tx.sign(nonceAccount)

    const txResult = await wallet.adapter.sendTransaction(tx, connection);

    await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txResult,
    });

    return { tx, nonceAccount };
};


const getNonceAccountKey = async (connection: Connection, wallet: Wallet, addTransactionMessage: (message: string) => void) => {
    const storedNonceAccount = localStorage.getItem('nonceAccount')

    if (storedNonceAccount) {
        return storedNonceAccount;
    }

    addTransactionMessage('Could not find a nonce account, creating one...');

    try {
        const { tx: nonceCreateTx, nonceAccount } = await createNonceAccount(connection, wallet);

        addTransactionMessage(`Nonce account created. You can find the nonce account public key behind the manage LUT
        button. BYOB saves the nonce account locally, but it is good to save the nonce account somewhere so if
        the browser data is cleared you can re-import it.
    `);
        localStorage.setItem('nonceAccount', nonceAccount.publicKey.toString());
        localStorage.setItem('nonceAccountSecret', nonceAccount.secretKey.toString());

        return nonceAccount.publicKey.toString();
    } catch (e) {
        console.log(e)
        return false;
    }
}

// Try to get a nonce account. If it doesn't exist (is not defined in localStorage
// from a previous transaction), create one and put it in localstorage
export const getNonceAccount = async (connection: Connection, wallet: Wallet, addTransactionMessage: (message: string) => void) => {
    const nonceAccountKey = await getNonceAccountKey(connection, wallet, addTransactionMessage)
    if (!nonceAccountKey) {
        return undefined;
    }

    const nonceAccount = await connection.getAccountInfo(new PublicKey(nonceAccountKey));
    if (!nonceAccount) {
        return undefined;
    }

    const data = NonceAccount.fromAccountData(nonceAccount.data);

    return { nonceAccount: data, publicKey: new PublicKey(nonceAccountKey) }
}
