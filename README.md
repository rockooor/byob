# BYOB

## Build Your Own Bot (BYOB) is a Solana web application to create atomic transactions using Versioned Transactions.

Utilising the power of Lookup Tables (LUTs) it is possible to chain together different actions into one atomic transaction, where if one element in the transaction fails, the whole chain of actions fail.

Additionally, because everything is happening inside one transaction, it is possible to utilise advanced defi products such as flash loans. An example use case is to instantly lever up or down on Degenbox strategies.

- Gitbook: [gitbook](https://byob.gitbook.io/docs/)
- Website: [byob](https://www.byob.so)

## Develop locally

If you want to create an action, it is useful to set up BYOB to work locally. It should be straightforward:

- clone repo
- `npm install`
- Put your RPC endpoint in a file called `.env.development`
- `npm run dev`

If you don't have an RPC endpoint, you can create one for free on e.g. Quicknode.
