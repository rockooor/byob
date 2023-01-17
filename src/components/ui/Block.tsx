import create from 'zustand';
import React, { useMemo } from 'react';
import { Action, ActionType, BaseState, InitializedAction } from '../../actions/types';
import MintInput from './MintInput';
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import DropdownInput from './DropdownInput';

type Props = {
    initializedAction: InitializedAction;
    order: number;
    totalActions: number;

    onRemove: (index: number) => void;
    onSwap: (from: number, to: number) => void;
};

const Block: React.FC<Props> = (props) => {
    // We know nothing about the state here except it contains the basestate
    const useBoundStore = create<BaseState>(props.initializedAction.state);

    const outputs = useBoundStore((state) => state.outputs);

    return (
        <div className="bg-white px-4 py-5 shadow-lg border-slate-100 border sm:rounded-lg sm:p-6 my-10 relative">
            <span className="isolate inline-flex rounded-md shadow-sm absolute top-0 right-0 -mt-5">
                <button
                    type="button"
                    disabled={props.order === props.totalActions - 1}
                    onClick={() => props.onSwap(props.order, props.order + 1)}
                    className="disabled:text-slate-400 relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    disabled={props.order === 0}
                    onClick={() => props.onSwap(props.order, props.order - 1)}
                    className="disabled:text-slate-400 relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => props.onRemove(props.order)}
                    className="disabled:text-slate-400 relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <TrashIcon className="text-orange-600 w-4 h-4" />
                </button>
            </span>

            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {props.initializedAction.protocol.name}
                    </h3>
                    <h3 className="text-md font-medium leading-6 text-gray-900">{props.initializedAction.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{props.initializedAction.description}</p>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className="grid grid-cols-6 gap-6">
                        {props.initializedAction.inputs.map((input) => (
                            <div key={input.name} className="col-span-6 sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    {input.name}
                                </label>
                                {input.type === ActionType.NUMBER && (
                                    <input
                                        type="number"
                                        onChange={(e) => input.set(parseFloat(e.target.value))}
                                        name={input.name}
                                        min="0"
                                        id={input.name}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                )}
                                {input.type === ActionType.STRING && (
                                    <input
                                        type="text"
                                        onChange={(e) => input.set(e.target.value)}
                                        name={input.name}
                                        id={input.name}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                )}
                                {input.type === ActionType.MINT && <MintInput name={input.name} set={input.set} />}
                                {input.type === ActionType.CHECK && (
                                    <input
                                        type="checkbox"
                                        onChange={(e) => input.set(e.target.checked)}
                                        name={input.name}
                                        id={input.name}
                                        className="mt-1 block w-6 h-6 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                )}
                                {input.type === ActionType.DROPDOWN && input.values && (
                                    <DropdownInput
                                        name={input.name}
                                        values={
                                            typeof input.values === 'string'
                                                ? useBoundStore((state) => state[input.values as string])
                                                : input.values
                                        }
                                        set={input.set}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {outputs && (
                        <div className="mt-6">
                            <h1 className="text-lg font-medium leading-6 text-gray-900 mb-3">Outputs</h1>
                            <div className="w-full overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {outputs.map(({ name, value }, i) => (
                                            <tr key={name} className={i % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Block;
