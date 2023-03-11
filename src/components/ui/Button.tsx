import React from 'react';
import { classNames } from '../../helpers/class';

export const Button = ({ children, inset, className, ...props }: any) => {
    return <button
        type="button"
        className={classNames(className, inset ?
            classNames(
                'border border-indigo-600',
                'text-gray-300 box-border hover:bg-gradient-to-r hover:from-indigo-800 hover:via-indigo-600 hover:to-indigo-800 hover:text-slate-200',
                'px-4 py-2 rounded-md'
            ) 
            : "justify-center rounded-md bg-gradient-to-r border border-indigo-600 from-indigo-800 via-indigo-600 to-indigo-800 hover:border-indigo-500 hover:from-indigo-700 hover:via-indigo-500 hover:to-indigo-700 text-slate-200 px-4 py-2"
        )}
        {...props}
    >
        {children}
    </button>
}