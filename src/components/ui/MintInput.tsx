import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { token } from '@project-serum/anchor/dist/cjs/utils';
import React, { useEffect, useState } from 'react';
import { classNames } from '../../helpers/class';
import { getTokenList, Token } from '../../helpers/token';

type Props = {
    name: string;
    set: (x: any) => void;
    defaultValue: Token;
};

const MintInput = (props: Props) => {
    const [tokenList, setTokenList] = useState<Token[]>();
    const [query, setQuery] = useState('');
    const [selectedToken, setSelectedToken] = useState<Token>();

    const filteredTokens =
        query === '' || query.length <= 2 || !tokenList
            ? []
            : tokenList.filter((token) => {
                return (
                    token.address.toLowerCase().includes(query.toLowerCase()) ||
                    token.symbol.toLowerCase().includes(query.toLowerCase()) ||
                    token.name.toLowerCase().includes(query.toLowerCase())
                );
            });

    useEffect(() => {
        getTokenList().then(setTokenList);

        if (props.defaultValue) {
            setSelectedToken(props.defaultValue)
        }
    }, []);

    if (!selectedToken) {
        return (
            <Combobox
                onChange={(token: Token) => {
                    props.set(token);
                    setQuery('');
                    setSelectedToken(token);
                }}
            >
                <div className="relative">
                    <MagnifyingGlassIcon
                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-slate-200"
                        aria-hidden="true"
                    />
                    <Combobox.Input
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-200 placeholder-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Search token..."
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>

                {filteredTokens.length > 0 && (
                    <Combobox.Options
                        static
                        className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-slate-200"
                    >
                        {filteredTokens.map((token) => (
                            <Combobox.Option
                                key={token.address}
                                value={token}
                                className={({ active }) =>
                                    classNames(
                                        'flex cursor-default select-none rounded-xl p-3',
                                        active && 'bg-slate-700'
                                    )
                                }
                            >
                                {({ active }) => (
                                    <>
                                        <div
                                            className={classNames(
                                                'flex h-10 w-10 flex-none items-center justify-center rounded-lg'
                                            )}
                                        >
                                            <img src={token.logoURI} />
                                        </div>
                                        <div className="ml-4 flex-auto">
                                            <p
                                                className={classNames(
                                                    'text-sm font-medium',
                                                    active ? 'text-slate-200' : 'text-slate-400'
                                                )}
                                            >
                                                {token.symbol}
                                            </p>
                                            <p
                                                className={classNames(
                                                    'text-sm',
                                                    active ? 'text-slate-400' : 'text-slate-500'
                                                )}
                                            >
                                                {token.name}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}

                {query !== '' && query.length > 2 && filteredTokens.length === 0 && (
                    <p className="p-4 text-sm text-slate-500">No tokens found.</p>
                )}
            </Combobox>
        );
    } else {
        return (
            <div className="bg-slate-800 border border-slate-700 pr-3 pl-3 pb-2 pt-2 mt-1 rounded-lg w-full flex items-center text-slate-200">
                <img src={selectedToken.logoURI} className="w-6 h-6 inline mr-2" />
                {selectedToken.symbol}
                <div className="flex grow justify-end">
                    <XCircleIcon
                        onClick={() => setSelectedToken(undefined)}
                        className="h-6 w-6 cursor-pointer inline"
                        aria-hidden="true"
                    />
                </div>
            </div>
        );
    }
};

export default MintInput;
