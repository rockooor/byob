import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { appendLocalLut, getLocalLuts } from '../../helpers/lut';
import { Button } from './Button';

type Props = {
    open: boolean;
    setOpen: (x: boolean) => void;
    privateKey: string
}

export default function LUTModal(props: Props) {
    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { }}>
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
                                <div className="mt-5 sm:mt-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-slate-200">
                                                Private Key
                                            </Dialog.Title>
                                            <p className="mt-2 text-sm text-slate-400">
                                                This is the private key of the bot account. Please keep it very very VERY safe as anyone can steal your bot account funds with this.
                                                You can import it in your own Solana wallet to access the funds of the bot.
                                                <textarea className="mt-3 bg-slate-600 w-full rounded-lg h-36" disabled>{props.privateKey}</textarea>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:ml-4 inline-flex w-20 justify-center">
                                        <Button
                                            type="button"
                                            onClick={() => props.setOpen(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
