# Munity EVM Contract

Hardhat project for the Munity EVM community NFT contract.

The contract implements ERC1155 community keys with ERC2981 royalties, per-community pricing, supply tracking, whitelist discounts, platform fee splitting, per-wallet mint limits, and reentrancy protection.

## Status

This source is the hardened EVM vNext contract. It preserves the live `buy(uint256,uint256)` public shape, but it is not byte-for-byte identical to the currently deployed Ethereum and Polygon contracts.

See `DEPLOYMENTS.md` before using this source in production.

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
```

To verify during deployment:

```shell
VERIFY=true npm run deploy:sepolia
```

## Layout

- `contracts/munity.sol` - production contract source
- `contracts/test/` - test-only helper contracts
- `scripts/deploy.js` - deploy-only script with optional verification
- `scripts/verifyContract.js` - verification helper
- `test/` - Hardhat tests

## Notes

- Solidity compiler: `0.8.24`
- EVM target: `paris`
- Optimizer: disabled, matching the verified live-contract metadata style
- Live Ethereum and Polygon deployments are recorded in `DEPLOYMENTS.md`
