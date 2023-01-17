import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PublicKey, Connection } from '@solana/web3.js';

export type Token = {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
};

export const getATA = async (
    connection: Connection,
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve: boolean = false
) => {
    const ata = await getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);

    const receiverAccount = await connection.getAccountInfo(ata);

    return {
        ata,
        mint,
        owner,
        createTx: !receiverAccount
            ? {
                ata: ata.toString(),
                ix: createAssociatedTokenAccountInstruction(
                  owner, // payer
                  ata, // ata
                  owner, // owner
                  mint // mint
              )
            }
            : undefined
    };
};

let tokenList: Token[] = [];
let tokenListPromise: Promise<any>;
export const getTokenList = async () => {
    if (tokenList.length > 0) {
        return tokenList;
    }

    if (!tokenListPromise) {
        tokenListPromise = new Promise((resolve) => {
            fetch('https://cache.jup.ag/tokens')
                .then((x) => x.json())
                .then(resolve);
        });
    }

    tokenList = await tokenListPromise;
    return tokenList;
};

export const getToken = async (mint: string) => {
    const tokenList = await getTokenList();
    return tokenList.find((token) => token.address === mint);
};

export const tokenMints = {
    wSOL: 'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USH: '9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6',
    cUSDC: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk'
};
