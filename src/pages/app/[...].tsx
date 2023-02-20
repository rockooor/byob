import * as React from 'react';
import { Router } from '@reach/router'
import { useWallet } from '@solana/wallet-adapter-react';
import { Index } from '../../components/app/Index';
import { PageProps } from 'gatsby';
import Navbar from '../../components/Navbar';
import { Library } from '../../components/app/Library';

const App = (props: PageProps) => {
    const wallet = useWallet();
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        setReady(true);
    }, [])

    if (!ready) {
        return null;
    }

    return (
        <>
            <Navbar uri={props.path!} />
            {wallet.publicKey ? (
                <Router>
                    <Index path="/app" />
                    <Library path="/app/library" />
                    <Index path="/app/:hash" />
                </Router>
            ) : (
                <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
                    <div className="mx-auto max-w-max">
                        <main className="sm:flex">
                            <p className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">BYOB</p>
                            <div className="sm:ml-6">
                                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                        Connect your wallet
                                    </h1>
                                    <p className="mt-1 text-base text-gray-500">
                                        Please connect your wallet in order to start using BYOB.
                                    </p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </>
    );
};

export default App;

export const Head = () => <title>Home Page</title>;
