import { Combobox, Dialog, Transition } from '@headlessui/react';
import { DocumentPlusIcon, FaceFrownIcon, GlobeAmericasIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useState } from 'react';
import { classNames } from '../../helpers/class';
import actions from '../../actions';
import { Action, ActionWithUid } from '../../actions/types';

type Props = {
    onAddAction: (x: ActionWithUid) => void;
};

const NewActionButton = (props: Props) => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);

    const allActions: ActionWithUid[] = Object.entries(actions)
        .map(protocol => ({ actions: protocol[1], protocolName: protocol[0] }))
        .map(protocol => Object.entries(protocol.actions).map(action => {
            return { ...action[1](), uid: `${protocol.protocolName}-${action[0]}` }
        }))
        .flat()

    const filteredItems = query
        ? allActions.filter((item) => {
              return (
                  item.name.toLowerCase().includes(query.toLowerCase()) ||
                  item.protocol.name.toLowerCase().includes(query.toLowerCase())
              );
          })
        : allActions;

    const groups = filteredItems.reduce((groups, item) => {
        return { ...groups, [item.protocol.name]: [...(groups[item.protocol.name] || []), item] };
    }, {} as Record<string, Action[]>);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative block w-full my-3 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <DocumentPlusIcon className="mx-auto h-16 w-16 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">Add action</span>
            </button>

            <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                                <Combobox
                                    onChange={(item: ActionWithUid) => {
                                        props.onAddAction(item);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="relative">
                                        <MagnifyingGlassIcon
                                            className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <Combobox.Input
                                            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                                            placeholder="Search..."
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                    </div>

                                    {filteredItems.length > 0 && (
                                        <Combobox.Options
                                            static
                                            className="max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2"
                                        >
                                            {Object.entries(groups).map(([category, items]) => (
                                                <li key={category}>
                                                    <h2 className="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">
                                                        {category}
                                                    </h2>
                                                    <ul className="mt-2 text-sm text-gray-800">
                                                        {items.map((item) => (
                                                            <Combobox.Option
                                                                key={`${item.protocol.name}${item.name}`}
                                                                value={item}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        'cursor-default select-none px-4 py-2',
                                                                        active && 'bg-indigo-600 text-white'
                                                                    )
                                                                }
                                                            >
                                                                {item.name}
                                                            </Combobox.Option>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </Combobox.Options>
                                    )}

                                    {query !== '' && filteredItems.length === 0 && (
                                        <div className="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
                                            <FaceFrownIcon
                                                className="mx-auto h-6 w-6 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <p className="mt-4 font-semibold text-gray-900">No results found</p>
                                            <p className="mt-2 text-gray-500">
                                                We couldn’t find anything with that term. Please try again.
                                            </p>
                                        </div>
                                    )}
                                </Combobox>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default NewActionButton;
