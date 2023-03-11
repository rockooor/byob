import { Link } from 'gatsby'
import React from 'react'
import { Button } from '../ui/Button'

export default function Example() {
    return (
        <div className="bg-gradient-to-t from-[#111] to-slate-900 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="relative isolate overflow-hidden px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
                    <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Try BYOB now!
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                        Visit our workflow library for some inspiration
                    </p>
                    <Link to="/app/library" className="mt-6 mx-auto max-w-2xl text-center flex justify-center">
                        <Button>Visit Library</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
