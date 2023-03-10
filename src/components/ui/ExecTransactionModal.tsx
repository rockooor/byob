import React, { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { CopyableLink } from './CopyableLink';

type Props = {
    open: boolean;
    setOpen: (x: boolean) => void;
    messages: string[];
    txId?: string;
    webhookUrl?: string;
    shareLink?: string;
}

export default function ExecTransactionModal(props: Props) {
    

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-slate-200">
                                            Executing...
                                        </Dialog.Title>
                                        {props.messages.map((message, i) => (
                                            <div key={i} className="mt-2">
                                                <p className="text-sm text-slate-500 font-mono">
                                                    {message}
                                                </p>
                                            </div>
                                        ))}
                                        {props.txId && <div className="mt-2">
                                            <p className="text-sm text-slate-500 font-mono">
                                                Transaction sent.{' '}
                                                <a
                                                    href={`https://solscan.io/tx/${props.txId}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="underline font-semibold"
                                                >
                                                    View on Solscan
                                                </a>
                                            </p>
                                        </div>}
                                        {props.webhookUrl && <div className="mt-2">
                                            <div className="text-sm text-slate-500 font-mono">
                                                Transaction signed! Here is your webhook url
                                                <CopyableLink url={props.webhookUrl} />
                                            </div>
                                        </div>}
                                        {props.shareLink && <div className="mt-2">
                                            <div className="text-sm text-slate-500 font-mono">
                                                Transaction signed! Here is your webhook url
                                                <CopyableLink url={props.shareLink} />
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                {(props.txId || props.shareLink || props.webhookUrl) && <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <Button
                                        type="button"
                                        onClick={() => props.setOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </div>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
