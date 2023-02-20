import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router'

import Heading from '../ui/Heading';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'gatsby';
import { Loading } from '../ui/Loading';

type LibraryAction = {
    name: string;
    hash: string;
    description: string;
    creator: string;
}

export const Library = (props: RouteComponentProps) => {
    const [actions, setActions] = useState<LibraryAction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.BACKEND_ENDPOINT}/get-featured`, {
            method: 'GET'
        })
            .then(x => x.json())
            .then((featured) => {
                setActions(featured.workflows)
                setLoading(false)
            })
    })

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-2">
                <div className="flex items-center mb-3">
                    <div className="flex-grow">
                        <Heading title="Workflow library" />
                    </div>
                </div>
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {actions.map((action) => (
                        <li
                            key={action.hash}
                            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
                        >
                            <div className="flex flex-1 flex-col p-8">
                                <h3 className="mt-6 text-lg font-medium text-gray-900">{action.name}</h3>
                                <dl className="mt-1 flex flex-grow flex-col justify-between">
                                    <dd className="text-sm text-gray-500">{action.description}</dd>
                                </dl>
                                {action.creator && <p className="text-gray-400 text-xs mt-6">Created by {action.creator}</p>}
                            </div>
                            <div>
                                <div className="-mt-px flex divide-x divide-gray-200">
                                    <div className="flex w-0 flex-1">
                                        <Link
                                            to={`/app/${action.hash}`}
                                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                                        >
                                            <PlusCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span className="ml-3">Import</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    <li
                        className="col-span-1 divide-y text-center border-0"
                    >
                        <button
                            onClick={() => window.open('https://twitter.com/Rockooor')}
                            type="button"
                            className="relative block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <PlusCircleIcon className="h-12 w-12 mx-auto text-gray-400" aria-hidden="true" />
                            <span className="mt-2 block text-sm font-medium text-gray-900">Your workflow here?</span>
                            <span className="mt-2 block text-sm font-sm text-gray-500">Send me a DM on Twitter</span>
                        </button>
                    </li>
                </ul>

            </div>
        </>
    );
};

