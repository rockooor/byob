import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../../helpers/class';

type Props = {
    name: string;
    set: (x: any) => void;
    values: { name: string; value: string }[];
    defaultValue: string | boolean | undefined | number;
};

export default function DropdownInput(props: Props) {
    const [selectedValue, setSelectedValue] = useState<string>();

    const setDropdownValue = (value: Props['values'][number]) => {
        setSelectedValue(value.name);
        props.set(value.value);
    };

    useEffect(() => {
        if (props.defaultValue) {
            const defaultToSet = props.values.find((value) => value.value === props.defaultValue)
            if (defaultToSet) {
                setSelectedValue(defaultToSet.name)
            }
        }
    }, [])

    return (
        <Menu as="div" className="relative block text-left mt-1">
            <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-600">
                    {selectedValue || 'Choose...'}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-900 border border-slate-700">
                    <div className="py-1">
                        {props.values.map((value) => (
                            <Menu.Item key={value.name}>
                                {({ active }) => (
                                    <a
                                        onClick={() => setDropdownValue(value)}
                                        className={classNames(
                                            active ? 'bg-slate-800 text-slate-200' : 'text-slate-300',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        {value.name}
                                    </a>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
