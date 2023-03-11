import React from 'react'
import { ArrowRightCircleIcon, InboxIcon, PlusCircleIcon, ShieldCheckIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline'

const features = [
    {
        name: 'Create a bot',
        description:
            'When you create a new bot, the private key is shared between BYOB and you. You can import it in any wallet, it\'s your account! The funds in this account are not shared with other BYOB users and you can take them out anytime. Furthermore, we rely on Amazon Web Services\' security mechanisms to make sure everything is safe. Additionally, we implemented all normal security practices like SSL, encryption, etc.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Create a workflow',
        description:
            'When you have created a bot, you can create a workflow and choose how often it should run. You can also define an execution filter, when the execution should not be run. Additionally, you can always share the workflow or import a workflow someone else shared or from our library!',
        icon: PlusCircleIcon,
    },
    {
        name: 'Sit back and let it run',
        description:
            'Once set up the bot will start running. All events are logged and if you are confirmed owner of the bot account, you can always view all execution logs.',
        icon: ArrowRightCircleIcon,
    },
]

export default function Example() {
    return (
        <div className="bg-gradient-to-b from-[#111] to-slate-900 py-6 sm:py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Bot accounts</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Bot accounts are the ultimate product of BYOB. Create a complex workflow, like a flash loan arbitrage or a DCA (Dynamic Cost Average) bot. Set it to execute every second or every week and define an execution filter (do not execute when $SOL is below $20). Let it run and auto-profit!
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="text-base font-semibold leading-7 text-white">
                                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-200">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
