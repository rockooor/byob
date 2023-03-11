import React, { Fragment } from 'react';
import { Link } from 'gatsby'
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { classNames } from '../helpers/class';
import { navigate } from 'gatsby';

// @ts-ignore
import logo from "../images/logo.png";

export default function Navbar(props: { uri: string }) {
    const navigation = [
        { name: 'Workflow Builder', href: '/app', current: props.uri === '/app' },
        { name: 'Bot Accounts', href: '/app/botaccounts', current: props.uri === '/app/botaccounts' },
        { name: 'Library', href: '/app/library', current: props.uri === '/app/library' },
        { name: 'Docs', href: 'https://byob.gitbook.io/docs/', current: props.uri === '/app' },
    ];

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="border-b border-indigo-900 mb-3">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Link to="/">
                                                <img
                                                    className="h-8 w-8"
                                                    src={logo}
                                                    alt="Your Company"
                                                />
                                            </Link>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => 
                                                    item.href.startsWith('http')
                                                    ?  (
                                                        <a
                                                            key={item.name}
                                                            href={item.href}
                                                            target={item.href.includes('https') ? '_blank' : undefined}
                                                            className={classNames(
                                                                'border border-transparent',
                                                                item.current
                                                                    ? 'bg-gradient-to-r border border-indigo-600 from-indigo-800 via-indigo-600 to-indigo-800 text-slate-200'
                                                                    : 'text-gray-300 box-border hover:border hover:border-indigo-600 hover:bg-gradient-to-r hover:from-indigo-800 hover:via-indigo-600 hover:to-indigo-800 hover:text-slate-200',
                                                                'px-3 py-2 rounded-md text-sm font-medium'
                                                            )}
                                                            aria-current={item.current ? 'page' : undefined}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )
                                                    : (
                                                        <Link
                                                            key={item.name}
                                                            to={item.href}
                                                            target={item.href.includes('https') ? '_blank' : undefined}
                                                            className={classNames(
                                                                'border border-transparent',
                                                                item.current
                                                                    ? 'bg-gradient-to-r border border-indigo-600 from-indigo-800 via-indigo-600 to-indigo-800 text-slate-200'
                                                                    : 'text-gray-300 box-border hover:border hover:border-indigo-600 hover:bg-gradient-to-r hover:from-indigo-800 hover:via-indigo-600 hover:to-indigo-800 hover:text-slate-200',
                                                                'px-3 py-2 rounded-md text-sm font-medium'
                                                            )}
                                                            aria-current={item.current ? 'page' : undefined}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <WalletMultiButton className="bg-slate-800" />
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-900 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'block px-3 py-2 rounded-md text-base font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pt-4 pb-3">
                                    <div className="flex items-center px-5">
                                        <WalletMultiButton />
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    );
}
