import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router'

import Heading from '../ui/Heading';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'gatsby';
import { Loading } from '../ui/Loading';
import { Button } from '../ui/Button';
import { Keypair, PublicKey } from '@solana/web3.js';
import { CopyableText } from '../ui/CopyableText';
import { createSignature } from '../../helpers/signMessage';
import { appendLocalBotAccount, getLocalStorageBotAccounts, setLocalBotAccounts } from '../../helpers/botAccounts';

export const BotAccounts = (props: RouteComponentProps) => {
    const [loading, setLoading] = useState(true);
    const [creatingBotAccount, setCreatingBotAccount] = useState(false);
    const [botAccounts, setBotAccounts] = useState<{ publicKey: PublicKey }[]>()

    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet();
    const { signMessage } = useWallet()

    useEffect(() => {
        getLocalStorageBotAccounts().then(setBotAccounts).then(() => {
            setLoading(false)
        })
    }, [])

    const getAndSetBotAccounts = async () => {
        const useLedger = localStorage.getItem("useLedger") === "true"
        const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/botaccount/list`, {
            method: 'POST',
            body: JSON.stringify({
                ledger: useLedger,
                ownerPublicKey: anchorWallet?.publicKey.toString(),
                signature: await createSignature(connection, anchorWallet!, signMessage, 'List bot accounts')
            })
        })
        const result = await resultRaw.json()

        setLocalBotAccounts(result.data)
        getLocalStorageBotAccounts().then(setBotAccounts)
    }

    const createBotAccount = async () => {
        setCreatingBotAccount(true)

        const useLedger = localStorage.getItem("useLedger") === "true"
        const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/botaccount/create`, {
            method: 'POST',
            body: JSON.stringify({
                ledger: useLedger,
                publicKey: anchorWallet?.publicKey.toString(),
                signature: await createSignature(connection, anchorWallet!, signMessage, 'Create a bot account')
            })
        })
        const result = await resultRaw.json()

        appendLocalBotAccount({ publicKey: result.publicKey })
        getLocalStorageBotAccounts().then(setBotAccounts)
        
        setCreatingBotAccount(false)
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-2 text-slate-200">
                <div className="flex items-center mb-3">
                    <div className="flex-grow">
                        <Heading title="Bot Accounts" />
                    </div>
                    <div className="text-right">
                        <Button
                            type="button"
                            disabled={creatingBotAccount}
                            onClick={createBotAccount}
                            className="mr-2"
                        >
                            Create
                        </Button>
                        <Button
                            type="button"
                            inset
                            onClick={getAndSetBotAccounts}
                        >
                            Fetch all
                        </Button>
                    </div>
                </div>
                <p>Manage your bot accounts here. Note that they are fully fledged Solana accounts and that your bot accounts are stored securely with your connected wallet. If for some reason the bots are disappeared from this view you can click on Fetch to retrieve all the bots from your connected wallet again securely. Don't forget to fund them, otherwise they can't do anything.</p>
                {botAccounts?.length! > 0 && <table className="min-w-full divide-y divide-indigo-900">
                    <thead className="">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Account
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-900">
                        {botAccounts?.map((botAccount) => (
                            <tr key={botAccount.publicKey.toString()}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-200 sm:pl-6 z-20">
                                    <CopyableText textToCopy={botAccount.publicKey.toString()} text={`${botAccount.publicKey.toString().slice(0, 3)}...${botAccount.publicKey.toString().slice(-3)}`} />
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a href={`https://solscan.io/account/${botAccount.publicKey.toString()}`} target="_blank" rel="noreferrer" className="text-indigo-700 hover:text-indigo-900">
                                        View on Solscan
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>
        </>
    );
}