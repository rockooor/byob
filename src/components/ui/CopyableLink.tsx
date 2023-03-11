import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React, { useRef } from "react";

export const CopyableLink = (props: { url: string }) => {
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
        <div className="relative mt-1 rounded-md shadow-sm">
            <input
                type="text"
                name="account-number"
                id="account-number"
                className="block w-full rounded-md border-slate-700 bg-slate-800 pr-10 sm:text-sm"
                value={props.url}
                disabled
            />
            <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                <ClipboardDocumentIcon onClick={() => copyToClipboard(props.url)} className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <div ref={copiedRef} className="absolute opacity-0 -right-5 z-20 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm">
                Copied!
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    );
}
