import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React, { useRef } from "react";

export const CopyableText = (props: { text: string, textToCopy: string }) => {
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
            <p className="">
                <ClipboardDocumentIcon onClick={() => copyToClipboard(props.textToCopy)} className="h-5 w-5 text-slate-400 inline mr-3 cursor-pointer" aria-hidden="true" />
                {props.text}
            </p>
            <div ref={copiedRef} className="absolute opacity-0 -left-5 z-20 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm">
                Copied!
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    );
}
