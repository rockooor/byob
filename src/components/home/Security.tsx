import React, { useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
    {
        name: 'Zero-risk mode',
        id: 'tier-self',
        description: 'Browser interaction only. Use BYOB as a transaction builder to create complex workflows and execute them using your connected wallet. Zero added BYOB risk.',
        features: [
            'Transaction builder',
            'Import workflow libraries',
            'Manual workflow execution',
            'Free*'
        ],
    },
    {
        name: 'Self-custodial mode',
        id: 'tier-custodial',
        description: 'Send limited information to our backend in order to enable advanced features. Interact using any wallet, even hardware wallets. Note that BYOB will not be to do anything you did not explicitely sign.',
        features: [
            'Everything in zero-risk mode',
            'Share workflows',
            'Webhook-based execution (build now, run later)',
            'Free*'
        ],
    },
    {
        name: 'Bot mode',
        id: 'tier-bot',
        description: 'Unleash the full feature set of BYOB.',
        features: [
            'Everything in self-custodial mode',
            'Run workflows in bot mode (bots share their private key between you and BYOB), see more below',
            'Recurring execution (run from every second to every year)',
            'Execution filter (run only if my arb is profitable)',
            '~$0.002 per trigger. Free* if bot owns a BYOB NFT (tba)',
        ],
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <div className="bg-gradient-to-t from-[#111] to-slate-900 py-6 sm:py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Our safety spectrum
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
                    Our core product is <a className="text-indigo-400" href="https://github.com/rockooor/byob" target="_blank" >open source</a>, completely browser-based and directly interacts between the protocols you select and your wallet. Full automation requires a bot account. You have completely control over everything.
                </p>
                <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                'ring-1 ring-white/10',
                                'rounded-3xl p-8 xl:p-10',
                                'bg-gradient-to-b from-[#111] to-slate-900'
                            )}
                        >
                            <div className="flex items-center justify-between gap-x-4">
                                <h3 id={tier.id} className="text-lg font-semibold leading-8 text-white">
                                    {tier.name}
                                </h3>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="text-center text-slate-400 mt-3 text-xs">
                    * Some actions have a small embedded fee, e.g. a 0.05% Jupiter swap fee
                </div>
            </div>
        </div>
    )
}
