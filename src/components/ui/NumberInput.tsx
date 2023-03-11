import { LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { StoreApi } from "zustand";
import { ActionInput } from "../../actions/types";

/**
 * A number input can return two values: a number (duh) or a string.
 * In case of a string, it represents an output state key (3.1)
 * and binds its value to the value of that state key using a state subscribe.
 * 
 * @param props 
 * @returns 
 */
export const NumberInput = (props: { input: ActionInput; inputIterator: number; previousStates: StoreApi<any>[]; boundTo?: string }) => {
    const [value, setValue] = useState((props.boundTo || props.input.defaultValue()) as number | string)
    const [boundValue, setBoundValue] = useState<number>()

    const unsubscribe = useRef<Function>()

    if (props.previousStates.length === 0) {
        return (
            <input
                type="number"
                onChange={(e) => props.input.set(parseFloat(e.target.value))}
                name={props.input.name}
                min="0"
                id={props.input.name}
                defaultValue={props.input.defaultValue() as number}
                className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-slate-200 shadow-sm "
            />
        )
    }

    if (typeof value === 'number') {
        return (
            <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                        type="number"
                        onChange={(e) => props.input.set(parseFloat(e.target.value))}
                        name={props.input.name}
                        min="0"
                        id={props.input.name}
                        defaultValue={props.input.defaultValue() as number}
                        className="block w-full rounded-none rounded-l-md border-slate-700 bg-slate-800 text-slate-200 "
                    /></div>
                <button
                    type="button"
                    onClick={() => {
                        setValue(`${props.previousStates.length - 1}.0`)
                    }}
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-slate-700 bg-slate-800 text-slate-200 px-4 py-1.5 text-sm font-medium  hover:bg-slate-700"
                >
                    <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            </div>
        )
    }
    
    if (typeof value === 'string') {
        const [stateKey, outputKey] = value.split('.').map(Number)
        const state = props.previousStates[stateKey]
        if (!state) {
            return null;
        }

        // If statement to prevent infinite rerenders
        if (boundValue === undefined) {
            setBoundValue(state.getState().outputs?.[outputKey]?.value)
            props.input.set(parseFloat(state.getState().outputs?.[outputKey]?.value))
            props.input.boundTo = value
            const _unsubscribe = state.subscribe((newState, prevState) => {
                if (newState.outputs[outputKey].value !== prevState.outputs[outputKey].value) {
                    setBoundValue(newState.outputs[outputKey].value)
                    props.input.set(parseFloat(newState.outputs[outputKey].value))
                }
            })
            unsubscribe.current = _unsubscribe;
        }

        return (
            <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                        type="number"
                        disabled
                        className="block w-full rounded-none rounded-l-md border-slate-700 bg-slate-800 text-slate-600 "
                        value={boundValue}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setValue(boundValue || 0)
                        setBoundValue(undefined)
                        unsubscribe.current!()
                        props.input.boundTo = undefined
                    }}
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-slate-700 bg-slate-800 text-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-700 "
                >
                    <XMarkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            </div>
        )
    }

    return null;
};
