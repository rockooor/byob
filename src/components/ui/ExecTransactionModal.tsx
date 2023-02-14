import React, { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

type Props = {
    open: boolean;
    setOpen: (x: boolean) => void;
    messages: string[];
    txId?: string;
    webhookUrl?: string;
    shareLink?: string;
}

export default function ExecTransactionModal(props: Props) {
    const copiedRef = useRef<HTMLDivElement>(null)
    const copyToClipboard = (text?: string) => {
        if (!text) {
            return;
        }

        navigator.clipboard.writeText(text);

        const ref = copiedRef.current;
        if (ref) {
            ref.style.opacity = '1'
            setTimeout(() => {
                ref.style.opacity = '0'
            }, 1000)
        }
    }

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
                            <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                            Executing Transaction...
                                        </Dialog.Title>
                                        {props.messages.map((message, i) => (
                                            <div key={i} className="mt-2">
                                                <p className="text-sm text-gray-500 font-mono">
                                                    {message}
                                                </p>
                                            </div>
                                        ))}
                                        {props.txId && <div className="mt-2">
                                            <p className="text-sm text-gray-500 font-mono">
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
                                            <div className="text-sm text-gray-500 font-mono">
                                                Transaction signed! Here is your webhook url
                                                <div className="relative mt-1 rounded-md shadow-sm">
                                                    <input
                                                        type="text"
                                                        name="account-number"
                                                        id="account-number"
                                                        className="block w-full rounded-md border-gray-300 bg-gray-100 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        value={props.webhookUrl}
                                                        disabled
                                                    />
                                                    <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ClipboardDocumentIcon onClick={() => copyToClipboard(props.webhookUrl)} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </div>
                                                    <div ref={copiedRef} className="absolute opacity-0 -right-5 z-20 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700">
                                                        Copied!
                                                        <div className="tooltip-arrow" data-popper-arrow></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {props.shareLink && <div className="mt-2">
                                            <p className="text-sm text-gray-500 font-mono">
                                                <a
                                                    href={props.shareLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="underline font-semibold"
                                                >
                                                    Share link
                                                </a>
                                            </p>
                                        </div>}
                                    </div>
                                </div>
                                {(props.txId || props.shareLink) && <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => props.setOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
