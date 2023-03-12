import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router'
import moment from 'moment';

import Heading from '../ui/Heading';
import { Loading } from '../ui/Loading';
import { Button } from '../ui/Button';
import { createSignature } from '../../helpers/signMessage';
import { BotWorkflow, getLocalStorageBotWorkflows, setLocalBotWorkflows } from '../../helpers/workflows';
import { Link } from 'gatsby';

export const WorkflowLogs = (props: RouteComponentProps<{ id: string }>) => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<any[]>()

    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet();
    const { signMessage } = useWallet()

    useEffect(() => {
        getLogs().then(() => setLoading(false))
    }, [])

    const getLogs = async () => {
        const useLedger = localStorage.getItem("useLedger") === "true"
        const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/botworkflow/listLogs`, {
            method: 'POST',
            body: JSON.stringify({
                ledger: useLedger,
                ownerPublicKey: anchorWallet?.publicKey.toString(),
                workflowId: props.id,
                signature: await createSignature(connection, anchorWallet!, signMessage, 'List workflow logs')
            })
        })
        const result = await resultRaw.json()

        setLogs(result.data)
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
                        <Link to="/app/botaccounts" className="text-indigo-400 hover:text-indigo-600">Back</Link>
                        <Heading title="View workflow" />
                    </div>
                    <div className="text-right">
                        <Button
                            type="button"
                            inset
                            onClick={getLogs}
                        >
                            Fetch again
                        </Button>
                    </div>
                </div>
                <p>View the most recent logs of your workflow here.</p>
                {logs?.length! > 0 && <table className="min-w-full divide-y divide-indigo-900">
                    <thead className="">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Date
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Executed?
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Hash
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Message
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-900">
                        {logs?.map((log) => (
                            <tr key={log.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 z-20">
                                    {moment(log.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 z-20">
                                    {log.executed ? 'yes' : 'no'}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 z-20">
                                    {log.txHash
                                        ? <a href={`https://solscan.io/tx/${log.txHash}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-600">
                                            {`${log.txHash.slice(0, 3)}...${log.txHash.slice(-3)}`}
                                        </a>
                                        : ''
                                    }
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 z-20">
                                    {log.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>
        </>
    );
}