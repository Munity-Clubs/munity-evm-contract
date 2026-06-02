# Munity EVM Smart Contract

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)
[![Verified: Ethereum](https://img.shields.io/badge/Ethereum-Sourcify%20Exact%20Match-green?style=flat-square)](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941)
[![Verified: Polygon](https://img.shields.io/badge/Polygon-Sourcify%20Exact%20Match-green?style=flat-square)](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db)
[![Security Policy](https://img.shields.io/badge/security-policy-blue?style=flat-square)](./SECURITY.md)
[![Handoff](https://img.shields.io/badge/handoff-doc-green?style=flat-square)](./HANDOFF.md)

Hardhat project for the Munity EVM community NFT contract. One canonical Solidity source, deployed across multiple EVM chains.

The contract implements ERC1155 community keys with ERC2981 royalties, per-community pricing, supply tracking, whitelist discounts, platform fee splitting, per-wallet mint limits, and reentrancy protection.

## Live on

| Chain | Address | Verification |
|---|---|---|
| Ethereum mainnet (1) | [`0x55c3…4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941) | Sourcify Exact Match · [details](./deployments/ethereum/) |
| Polygon PoS (137) | [`0xaF02…08db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) | Sourcify Exact Match · [details](./deployments/polygon/) |
| Base (8453) | [`0x6c60…2083`](https://base.blockscout.com/address/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083) | Sourcify Exact Match · [details](./deployments/base/) |
| Optimism (10) | *pending — Round 2 A3 deploy* | — |
| Arbitrum One (42161) | *pending — Round 2 A3 deploy* | — |

Full per-chain records in [`deployments/`](./deployments/) — one folder per chain with `address.json` + `verification.md`.

## Source status

This source is the hardened EVM vNext contract. It preserves the live `buy(uint256,uint256)` public shape, but the Ethereum and Polygon deployments above are running an earlier (legacy) bytecode generation. All future chain deployments use the hardened source in this repo. Both source generations are MIT-licensed and Sourcify-verified.

See [`DEPLOYMENTS.md`](./DEPLOYMENTS.md) for the summary table and [`deployments/README.md`](./deployments/README.md) for the source-vs-deployment note before using this source in production.

## Setup

```shell
npm ci
```

For live deployments, copy `.env.example` to `.env` and fill only the values needed for the target network. Use a dedicated deployer wallet.

## Commands

```shell
npm run compile
npm test
npm run deploy:hardhat
npm run deploy:local
npm run deploy:sepolia
npm run deploy:mainnet
npm run deploy:polygon
npm run deploy:amoy
npm run deploy:base-sepolia
npm run deploy:base
npm run deploy:optimism-sepolia
npm run deploy:optimism
npm run deploy:arbitrum-sepolia
npm run deploy:arbitrum
```

To verify during deployment:

```shell
VERIFY=true npm run deploy:base-sepolia
```

## Layout

- `contracts/munity.sol` — production contract source
- `contracts/test/` — test-only helper contracts
- `scripts/deploy.js` — deploy-only script with optional verification
- `scripts/verifyContract.js` — verification helper
- `test/` — Hardhat tests
- `DEPLOYMENTS.md` — canonical ledger of live deployments + verification proofs
- `HANDOFF.md` — one-page orientation for collaborators, auditors, grant reviewers
- `SECURITY.md` — vulnerability disclosure policy

## Notes

- Solidity compiler: `0.8.24`
- EVM target: `paris`
- Optimizer: disabled, matching the verified live-contract metadata style
- Live Ethereum and Polygon deployments are recorded in [`DEPLOYMENTS.md`](./DEPLOYMENTS.md)