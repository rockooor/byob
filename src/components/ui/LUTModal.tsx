import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { appendLocalLut, getLocalLuts } from '../../helpers/lut';
import { Button } from './Button';

type Props = {
    open: boolean;
    setOpen: (x: boolean) => void;
}

export default function LUTModal(props: Props) {
    const [luts, setLuts] = useState<string[]>(getLocalLuts());
    const inputRef = useRef<HTMLInputElement>(null)

    const onImport = (lut?: string) => {
        if (!lut) {
            return
        }

        appendLocalLut(lut)
        setLuts(getLocalLuts())
    }

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
                                                LUTs
                                            </Dialog.Title>
                                            <p className="mt-2 text-sm text-slate-400">
                                                Below you'll find a list of all the Lookup Table Accounts (LUTs) that are locally stored.
                                                They can be created during a transaction that contained a lot of
                                                account keys or imported by yourself. Having a lot of LUTs has no
                                                downsides, however creating a LUT costs a bit of SOL. When you are the authority (owner) of
                                                the LUT, you can close in order to reclaim the SOL. In order to do so,
                                                first deactive the LUT, then wait for a few minutes (500 blocks) and then close it. Those
                                                actions can be found in the TX builder under System {">"} LUT.
                                            </p>

                                            <table className="min-w-full divide-y divide-indigo-900">
                                                <thead className="">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">
                                                            Account
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-indigo-900">
                                                    {luts.map((lut) => (
                                                        <tr key={lut}>
                                                            <td className="truncate whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-200 sm:pl-6">
                                                                {`${lut.slice(0, 3)}...${lut.slice(-3)}`}
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <a href={`https://solscan.io/account/${lut}`} target="_blank" rel="noreferrer" className="text-indigo-700 hover:text-indigo-900">
                                                                    View on Solscan
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td className="truncate whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-200 sm:pl-6">
                                                            <input
                                                                type="text"
                                                                ref={inputRef}
                                                                placeholder="LUT to add"
                                                                className="mt-2 block w-full rounded-md border-indigo-900 bg-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            />
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <Button
                                                                type="Button"
                                                                onClick={() => {
                                                                    onImport(inputRef.current?.value);
                                                                }}
                                                            >
                                                                Import
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
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
