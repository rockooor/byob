import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from 'gatsby';
import { BsTwitter, BsDiscord } from 'react-icons/bs'

// @ts-ignore
import logo from "../images/logo.png";
import { Button } from '../components/ui/Button';
import Security from '../components/home/Security';
import BotAccounts from '../components/home/BotAccounts';
import WorkflowBuilder from '../components/home/WorkflowBuilder';
import VisitCTA from '../components/home/VisitCTA';

export default function Index() {
    return (
        <div className="relative overflow-hidden">
            <Popover as="header" className="relative">
                <div className="pt-6">
                    <nav
                        className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
                        aria-label="Global"
                    >
                        <div className="flex flex-1 items-center">
                            <div className="flex w-full items-center justify-between md:w-auto">
                                <a href="#">
                                    <img
                                        className="h-8 w-auto sm:h-10"
                                        src={logo}
                                        alt=""
                                    />
                                </a>
                            </div>
                            <div className="hidden space-x-8 md:ml-10 md:flex">
                            </div>
                        </div>
                        <div className="flex md:items-center md:space-x-6">
                            <a href="http://discord.gg/DC99NepSmx" target="_blank" className="text-slate-200 hover:text-slate-400 text-2xl">
                                <BsDiscord />
                            </a>
                            <a href="https://twitter.com/byob_so" target="_blank" className="text-slate-200 hover:text-slate-400 text-2xl">
                                <BsTwitter />
                            </a>

                            <Link
                                to="/app"
                            >
                                <Button type="button">App</Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </Popover>

            <main className="h-full min-h-screen">
                <div className="pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-6">
                    <div className="mx-auto max-w-7xl lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                                <div className="lg:py-24">
                                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                        <span className="block">BYOB</span>
                                        <span className="block text-indigo-400">Build your own bot</span>
                                    </h1>
                                    <p className="mt-3 mb-6 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        Create complex workflows using our no-code interface. Interact with flash loans, create collateral swaps, limit orders,
                                        stop losses or even self-custodial insurance. It's all possible with BYOB!
                                    </p>

                                    <Link
                                        to="/app"
                                    >
                                        <Button>App</Button>
                                    </Link>
                                    <a
                                        href="https://byob.gitbook.io/docs"
                                        target="_blank"
                                    >
                                        <Button inset className="ml-2">Gitbook</Button>
                                    </a>
                                    <a
                                        href="https://github.com/rockooor/byob"
                                        target="_blank"
                                    >
                                        <Button inset className="ml-2">Github</Button>
                                    </a>
                                </div>
                            </div>
                            <div className="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0">
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                    {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
                                    <img
                                        className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                        src={logo}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111] py-6 sm:py-6">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl sm:text-center">
                            <div className="flex items-center justify-center text-slate-200 gap-6">
                                <div className="w-4xl bg-gradient-to-b from-[#111] to-slate-900 border border-slate-900 m-6 p-6 rounded-lg">
                                    <h2 className="text-2xl font-bold">Sandstorm</h2>
                                    <p>
                                        Winner Versioned Tx Track
                                    </p>
                                </div>
                                <div className="w-4xl bg-gradient-to-b from-[#111] to-slate-900 border border-slate-900 m-6 p-6 rounded-lg">
                                    <h2 className="text-2xl font-bold">Sandstorm</h2>
                                    <p>
                                        Grand prize runner-up
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <WorkflowBuilder />
                <Security />
                <BotAccounts />
                <VisitCTA />
            </main>
        </div>
    );
}
