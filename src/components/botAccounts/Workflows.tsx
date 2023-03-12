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

export const Workflows = (props: RouteComponentProps) => {
    const [loading, setLoading] = useState(true);
    const [botWorkflows, setBotWorkflows] = useState<BotWorkflow[]>()

    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet();
    const { signMessage } = useWallet()

    useEffect(() => {
        const botWorkflows = getLocalStorageBotWorkflows()
        setBotWorkflows(botWorkflows)
        setLoading(false)
    }, [])

    const getAndSetBotWorkflows = async () => {
        const useLedger = localStorage.getItem("useLedger") === "true"
        const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/botworkflow/list`, {
            method: 'POST',
            body: JSON.stringify({
                ledger: useLedger,
                ownerPublicKey: anchorWallet?.publicKey.toString(),
                signature: await createSignature(connection, anchorWallet!, signMessage, 'List workflows')
            })
        })
        const result = await resultRaw.json()

        setLocalBotWorkflows(result.data)
        const botWorkflows = getLocalStorageBotWorkflows()
        setBotWorkflows(botWorkflows)
    }

    const stopWorkflow = async (workflowId: string) => {
        const useLedger = localStorage.getItem("useLedger") === "true"
        const resultRaw = await fetch(`${process.env.BACKEND_ENDPOINT}/botworkflow/stop`, {
            method: 'POST',
            body: JSON.stringify({
                ledger: useLedger,
                ownerPublicKey: anchorWallet?.publicKey.toString(),
                workflowId,
                signature: await createSignature(connection, anchorWallet!, signMessage, 'Stop workflow')
            })
        })
        await resultRaw.json()

        getAndSetBotWorkflows()
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
                        <Heading title="Workflows" />
                    </div>
                    <div className="text-right">
                        <Button
                            type="button"
                            inset
                            onClick={getAndSetBotWorkflows}
                        >
                            Fetch all
                        </Button>
                    </div>
                </div>
                <p>Manage your workflows below. To get updated data on execution dates or when somehow you're missing workflows, press the fetch button to update this list securely.</p>
                {botWorkflows?.length! > 0 && <table className="min-w-full divide-y divide-indigo-900">
                    <thead className="">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Workflow name
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                Next execution date
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-900">
                        {botWorkflows?.map((botWorkflow) => (
                            <tr key={botWorkflow.name}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 z-20">
                                    {botWorkflow.name}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 z-20">
                                    {botWorkflow.nextExecutionTime > 80000000000000
                                        ? 'Never'
                                        : moment(botWorkflow.nextExecutionTime).format('MMMM Do YYYY, h:mm:ss a')
                                    }
                                    
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-right text-slate-200 sm:pl-6 z-20">
                                    <Link to={`/app/workflows/${botWorkflow.id}`} className="text-indigo-400 hover:text-indigo-600">
                                        View logs
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 text-sm text-right text-slate-200 sm:pl-6 z-20">
                                    {botWorkflow.nextExecutionTime > 80000000000000
                                        ? 'Stopped'
                                        : <Button onClick={() => stopWorkflow(botWorkflow.id)} className="bg-gradient-to-r border border-red-600 from-red-800 via-red-600 to-red-800 hover:border-red-500 hover:from-red-700 hover:via-red-500 hover:to-red-700">
                                            Stop
                                        </Button>
                                    }
                                   
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>
        </>
    );
}