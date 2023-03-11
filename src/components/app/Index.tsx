import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps  } from '@reach/router'

import { ActionWithUid, InitializedAction } from '../../actions/types';
import Block from '../ui/Block';
import ExecTransactionModal from '../ui/ExecTransactionModal';
import Heading from '../ui/Heading';
import NewActionButton from '../ui/NewActionButton';
import LUTModal from '../ui/LUTModal';
import { executeTransaction, shareTransaction } from '../../helpers/transaction';
import { initialize } from '../../helpers/action';
import allActions from '../../actions';
import { Switch } from '@headlessui/react';
import { classNames } from '../../helpers/class';
import { VersionedTransaction } from '@solana/web3.js';
import { Loading } from '../ui/Loading';
import { Button } from '../ui/Button';

export const Index = (props: RouteComponentProps<{hash: string}>) => {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { wallet, signTransaction } = useWallet();
    const [actions, setActions] = useState<InitializedAction[]>([]);
    const [errorsLogs, setErrorLogs] = useState<string[]>([]);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [transactionModalMessages, setTransactionModalMessages] = useState<string[]>([])
    const [lutModalOpen, setLutModalOpen] = useState(false);
    const [sentTxId, setSentTxId] = useState<string>()
    const [webhookUrl, setWebhookUrl] = useState<string>()
    const [shareLink, setShareLink] = useState<string>()
    const [runWebhook, setRunWebhook] = useState(false)

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If opened, clear all info
        if (transactionModalOpen) {
            setTransactionModalMessages([])
            setSentTxId(undefined)
            setShareLink(undefined)
            setWebhookUrl(undefined)
        }
    }, [transactionModalOpen])

    const addTransactionMessage = (message: string) => {
        setTransactionModalMessages(state => [
            ...state,
            message
        ])
    }

    const resetTransactionMessages = () => setTransactionModalMessages([])

    if (!anchorWallet || !wallet) {
        return null;
    }

    const onAddAction = async (action: ActionWithUid) => {
        const initializedAction = await initialize(connection, anchorWallet, action);
        setActions([...actions, initializedAction])
    };
    const onRemoveAction = (index: number) => setActions(actions.filter((item, i) => i !== index));
    const onSwapAction = (from: number, to: number) =>
        setActions(() => {
            const newActions: InitializedAction[] = [...actions];
            newActions.splice(from, 1, newActions.splice(to, 1, newActions[from])[0]);
            return newActions;
        });

    useEffect(() => {
        if (!props.hash) {
            return
        }

        setLoading(true)

        fetch(`${process.env.BACKEND_ENDPOINT}/get-link/${props.hash}`, {
            method: 'GET'
        })
            .then(x => x.json())
            .then(async ({ transaction }) => {
                const workflow = JSON.parse(transaction.data)
                // Loop over actions, initialize them and set the state
                return Promise.all(workflow.map(async actionToImport => {
                    // Find action
                    const [protocol, name] = actionToImport.uid.split('-')
                    const currentAction = allActions[protocol][name]()
                    
                    const initializedAction = await initialize(connection, anchorWallet, currentAction)
                    await initializedAction.state.setState(actionToImport.state)
                    return { ...initializedAction, boundedInputs: actionToImport.boundedInputs, uid: `${protocol}-${name}` }
                }))
            })
            .then(setActions)
            .then(() => setLoading(false))
    }, [props.hash])

    if (loading) {
        return (
            <Loading />
        )
    }

    const allStates = actions.map((action) => {
        return action.state;
    });

    return (
        <>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-2">
                <div className="flex items-center">
                    <div className="flex-grow">
                        <Heading title="Transaction Builder" />
                    </div>

                    <div className="text-right">
                        <Button
                            inset
                            type="button"
                            onClick={() => setLutModalOpen(true)}
                        >
                            Manage LUTs
                        </Button>
                    </div>
                </div>
                

                {actions.map((action, i) => (
                    <Block
                        key={action.id}
                        previousStates={allStates.slice(0, i)}
                        initializedAction={action}
                        order={i}
                        totalActions={actions.length}
                        onRemove={onRemoveAction}
                        onSwap={onSwapAction}
                    />
                ))}

                <NewActionButton onAddAction={onAddAction} />

                <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-right sm:px-6 mb-6">
                    <Switch.Group as="div" className="flex items-center justify-end mb-3">
                        <Switch.Label as="span" className="mr-3">
                            <span className="text-sm font-medium text-slate-400">
                                {runWebhook ? 'Sign and run later (create a webhook)' : 'Sign and run immediately'}
                            </span>
                        </Switch.Label>
                        <Switch
                            checked={runWebhook}
                            onChange={setRunWebhook}
                            className={classNames(
                                runWebhook ? 'bg-blue-600' : 'bg-green-600',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    runWebhook ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </Switch.Group>

                    <Button
                        type="button"
                        inset
                        className="mr-2"
                        onClick={() => shareTransaction(actions, setTransactionModalOpen, addTransactionMessage, resetTransactionMessages, setShareLink)}
                    >
                        Share
                    </Button>

                    <Button
                        type="button"
                        onClick={() => executeTransaction(connection, wallet, signTransaction, actions, runWebhook, setErrorLogs, setTransactionModalOpen, addTransactionMessage, resetTransactionMessages, setSentTxId, setWebhookUrl)}
                        
                    >
                        Run
                    </Button>
                </div>

                {errorsLogs.length > 0 && <div className="w-full overflow-hidden md:rounded-lg border-slate-700 border my-6">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-800">
                            <tr>
                                <th
                                    scope="col"
                                    className="whitespace-nowrap text-left font-mono py-2 pl-4 pr-3  text-slate-200 sm:pl-6 text-lg"
                                >
                                    Something went wrong. Error log:
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {errorsLogs.map((log, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800'}>
                                    <td className="whitespace-nowrap font-mono py-2 pl-4 pr-3 text-sm text-slate-200 sm:pl-6 border-b border-slate-700">
                                        {log}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}

                <ExecTransactionModal
                    open={transactionModalOpen}
                    setOpen={setTransactionModalOpen}
                    messages={transactionModalMessages}
                    txId={sentTxId}
                    webhookUrl={webhookUrl}
                    shareLink={shareLink}
                />

                <LUTModal
                    open={lutModalOpen}
                    setOpen={setLutModalOpen}
                />
            </div>
        </>
    );
};
