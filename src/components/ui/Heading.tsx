import React from 'react';

const Heading: React.FC<{ title: string }> = (props) => {
    return (
        <div className="md:flex md:items-center md:justify-center">
            <div className="min-w-0 flex-1">
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {props.title}
                </h2>
            </div>
        </div>
    );
};

export default Heading;
