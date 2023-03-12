import React from 'react';
import { RouteComponentProps } from '@reach/router'
import { Accounts } from '../botAccounts/Accounts';
import { Workflows } from '../botAccounts/Workflows';

export const BotAccounts = (props: RouteComponentProps) => {
    return (
        <div className="mb-6">
            <Accounts />
            <div className="mt-6" />
            <Workflows />
        </div>
    );
}