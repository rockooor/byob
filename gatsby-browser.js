import './src/styles/global.css'

import React from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"

import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets"

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

require('@solana/wallet-adapter-react-ui/styles.css');

export const wrapPageElement = ({ element }) => {
  const endpoint = 'https://aged-little-layer.solana-mainnet.discover.quiknode.pro/eed2c3519c41276716f43fa05cc959c69aef6448/'
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ]

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{element}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
