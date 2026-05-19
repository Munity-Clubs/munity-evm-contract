# Munity EVM

EVM port of the Munity community NFT contract. ERC1155 + ERC2981 with per-community pricing, supply, whitelist discounts, and a platform fee.

## Setup

```shell
npm install
cp .env.example .env
# fill in PRIVATE_KEY and the API keys you need
```

## Common tasks

```shell
npm run compile
npm run test
npm run local              # deploy to a local hardhat node
npm run deploy:sepolia
npm run deploy:bsc
```

## Layout

- `contracts/munity.sol` — main contract
- `scripts/maindeploy.js` — deploy + smoke-test script
- `scripts/verifyContract.js` — Etherscan/BscScan verify helper
- `scripts/mineBlocks.js` — local time/block advance helper
- `test/` — Hardhat tests