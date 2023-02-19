import { PublicKey } from '@solana/web3.js';
import { FLASH_LOAN_MASTERY_PROGRAM_ID } from 'flash-loan-mastery';

export interface PoolInfo {
    mint: PublicKey;
    decimals: number;
    bank: PublicKey;
    poolShareMint: PublicKey;
}

export const TOKENS = {
    programId: FLASH_LOAN_MASTERY_PROGRAM_ID,
    referrer: new PublicKey(process.env.BYOB_REFERRAL_ACCOUNT!),
    pools: {
        ATLAS: {
            mint: new PublicKey('ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx'),
            decimals: 8,
            bank: new PublicKey('FnZd8BV5bS7dVxt7dm9rQoNgFHZg4UCaN4oZUVrgkAvZ'),
            poolShareMint: new PublicKey('6pCiQQkw3eTkYgdgSEPobUEXvuP2SSmvG9cr11szzeBP')
        },
        BONK: {
            mint: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
            decimals: 5,
            bank: new PublicKey('pmGBZFCQ3C9mk49naF7Wag4Bjz3KhoJyj6nitq6tEwT'),
            poolShareMint: new PublicKey('EEgkPj5Z4J9KMCFSchiMz9wGusJgw6wqGPMyMJT9hoEZ')
        },
        MSOL: {
            mint: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
            decimals: 9,
            bank: new PublicKey('Foj91yYCU9mxJREyW7bGrK7kr46PNWW4ZsKQEnbzSxEc'),
            poolShareMint: new PublicKey('GFR34LCKCnYaR2eYMpXRMKLUWvu16ykDizEpa3LiUmtb')
        },
        SHDW: {
            mint: new PublicKey('SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y'),
            decimals: 9,
            bank: new PublicKey('8eCsvooRmAUZHeuVFqSXAA2G24iZQVmgPhZeg1ddtFEb'),
            poolShareMint: new PublicKey('AM5ozyNKf2FqUxjPyBhprn595kxLUhy2sChpLSVYnhGi')
        },
        SOL: {
            mint: new PublicKey('So11111111111111111111111111111111111111112'),
            decimals: 9,
            bank: new PublicKey('BbyiA4GS5dVhpoxChJV7E5wFQRbSdZn3hrP3U327y898'),
            poolShareMint: new PublicKey('FbxGi49knDjJnBtc98Afgfeo1XsSLZU8pnt6UYRenFxf')
        },
        USDC: {
            mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
            decimals: 6,
            bank: new PublicKey('97J72rNZPjbs6mfkf7DanFNVwmqV5n3R3DxBAxGxjjhK'),
            poolShareMint: new PublicKey('GEyQ1kwgke17WLkBoZmRDqv2XdVxxZiTLjcoY5Vy9swe')
        },
        USDT: {
            mint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
            decimals: 6,
            bank: new PublicKey('3GccACgznR4vCK7Shnk7d2dWiFWqgpDxC7bgyRxTAatf'),
            poolShareMint: new PublicKey('S2krPXLFJercCB5T7m3QiyeAWVRthbPe3ExUchH1tzq')
        }
    }
};

export const protocol = {
    name: 'Flash Loan Mastery',
    site: 'https://flashloanmastery.com'
};
