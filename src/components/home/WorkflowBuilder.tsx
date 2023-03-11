import React from 'react'
import {
    ArrowPathIcon,
    CloudArrowUpIcon,
    Cog6ToothIcon,
    FingerPrintIcon,
    LockClosedIcon,
    ServerIcon,
} from '@heroicons/react/20/solid'

// @ts-ignore
import screenshot from "../../images/feature-workflow-builder.png";
import { BoltIcon, ClipboardDocumentListIcon, EllipsisHorizontalCircleIcon, UserIcon } from '@heroicons/react/24/solid';

const features = [
    {
        name: 'Interact with flash loans.',
        description: 'BYOB supports two flash loan protocols: Flash Loan Mastery and Solend',
        icon: BoltIcon,
    },
    {
        name: 'Swap everything.',
        description: 'Jupiter is integrated as swap aggregator',
        icon: ArrowPathIcon,
    },
    {
        name: 'Staking protocols.',
        description: 'Swap and stake in one transaction using Marinade',
        icon: LockClosedIcon,
    },
    {
        name: 'Combine big workflows.',
        description: 'Create recurring limit orders, automatically DCA, whatever you want',
        icon: ClipboardDocumentListIcon,
    },
    {
        name: 'Run now, share, execute later or execute as bot.',
        description: 'You have total control over what happens when',
        icon: UserIcon,
    },
    {
        name: 'More to come...',
        description: 'Planned integrations are Hadeswap/Tensor, Orca, Kamino, Hubble, ...',
        icon: EllipsisHorizontalCircleIcon,
    },
]

export default function Example() {
    return (
        <div className="bg-gradient-to-b from-[#111] to-slate-900 py-6 sm:py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Workflow builder</p>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Our simple to use no-code workflow builder lets you create complex workflows on Solana in no time. Flash loan arbitrage? 1 minute. Limit order? 1 minute. Choose from our ever-growing list of protocols and compose all of them on top of eachother!
                    </p>
                </div>
            </div>
            <div className="relative overflow-hidden pt-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <img
                        src={screenshot}
                        alt="App screenshot"
                        className="mb-[-2%] rounded-xl shadow-2xl ring-1 ring-white/10"
                        width={2432}
                        height={1442}
                    />
                    <div className="relative" aria-hidden="true">
                        <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-900 pt-[7%]" />
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
                <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative pl-9">
                            <dt className="inline font-semibold text-white">
                                <feature.icon className="absolute top-1 left-1 h-5 w-5 text-indigo-500" aria-hidden="true" />
                                {feature.name}
                            </dt>{' '}
                            <dd className="inline">{feature.description}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    )
}
