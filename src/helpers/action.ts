import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { v4 } from "uuid";
import { ActionWithUid } from "../actions/types";

export const initialize = async (connection: Connection, wallet: AnchorWallet, action: ActionWithUid) => {
    const initializedAction = await action.initialize(connection, wallet)
    return {
        id: v4(),
        uid: action.uid,
        protocol: action.protocol,
        name: action.name,
        description: action.description,
        ...initializedAction,
    }
};
