import { PublicKey } from '@solana/web3.js';

export const TOKENS = {
    psmMintAddress: new PublicKey('Bizd3Pmkvp9C792ZNDn6ogpExqatUUHEzcvu2Q6JHDfb'),
    referralStatePublicKey: new PublicKey('6ENsq1nuZKuDv6qus91W4vzC37cEFEe1Xp1cgvMeQnDb'),
    referralAccountPublicKey: new PublicKey('2iotFL6gxQmkjNaymEFamhQz1gnzSyZq6n1LKVVgNEKc'),
    hedgeProgramAccount: new PublicKey('HedgeEohwU6RqokrvPU4Hb6XKPub8NuKbnPmY7FoMMtN')
};

export const protocol = {
    name: 'Hedge',
    site: 'https://www.hedge.so'
};
