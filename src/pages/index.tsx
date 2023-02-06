import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from 'gatsby';

// @ts-ignore
import logo from "../images/logo.png";

export default function Index() {
    return (
        <div className="relative overflow-hidden">
            <Popover as="header" className="relative">
                <div className="bg-gray-900 pt-6">
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
                                <div className="-mr-2 flex items-center md:hidden">
                                    <Popover.Button className="focus-ring-inset inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white">
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="hidden space-x-8 md:ml-10 md:flex">
                            </div>
                        </div>
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            <Link
                                to="/app"
                                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
                            >
                                App
                            </Link>
                        </div>
                    </nav>
                </div>

                <Transition
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        focus
                        className="absolute inset-x-0 top-0 z-10 origin-top transform p-2 transition md:hidden"
                    >
                        <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
                            <div className="flex items-center justify-between px-5 pt-4">
                                <div>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt=""
                                    />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="pt-5 pb-6">
                                <div className="space-y-1 px-2">
                                    <Link
                                        to="/app"
                                        className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        App
                                </Link>
                                </div>
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>

            <main className="h-full min-h-screen bg-gray-900">
                <div className="bg-gray-900 pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14">
                    <div className="mx-auto max-w-7xl lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                                <div className="lg:py-24">
                                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                        <span className="block">BYOB</span>
                                        <span className="block text-indigo-400">Build your own bot</span>
                                    </h1>
                                    <p className="mt-3 mb-6 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        Create atomic transactions on Solana using a user friendly interface.
                                    </p>

                                    <Link
                                        to="/app"
                                        className="inline-flex mr-4 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        App
                                    </Link>
                                    <a
                                        href="https://byob.gitbook.io/docs"
                                        target="_blank"
                                        className="inline-flex mr-4 justify-center rounded-md border border-transparent border-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Gitbook
                                    </a>
                                    <a
                                        href="https://github.com/rockooor/byob"
                                        target="_blank"
                                        className="inline-flex justify-center rounded-md border border-transparent border-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Github
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

                {/* More main page content here... */}
            </main>
        </div>
    );
}
