# Deployments

At-a-glance summary of every chain where the Munity EVM contract is live. For full per-chain metadata + verification proofs, see the [`deployments/`](./deployments/) folder.

## Live Production Contracts

| Chain | Chain ID | Address | Source | Verification | Per-chain folder |
| --- | --- | --- | --- | --- | --- |
| Ethereum mainnet | 1 | `0x55c31189539606D5b1Cb61d01D34E9180fca4941` | Legacy (pre-hardened) | Sourcify Exact Match · Etherscan ✓ | [`deployments/ethereum/`](./deployments/ethereum/) |
| Polygon PoS | 137 | `0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db` | Legacy (pre-hardened) | Sourcify Exact Match · Polygonscan ✓ | [`deployments/polygon/`](./deployments/polygon/) |

Both live contracts expose `buy(uint256 _id, uint256 _amount)`.

## Pending Deployments

These chains have config wired in [`hardhat.config.js`](./hardhat.config.js) and grant pipeline coverage, awaiting deploy:

| Chain | Chain ID | Status | Grant pipeline |
| --- | --- | --- | --- |
| Base | 8453 | Round 2 A3 deploy — config ready, gas funding pending | §4.8 Base Builder Grants + §4.15 Coinbase Onchain Summer |
| Optimism | 10 | Round 2 A3 deploy — config ready, gas funding pending | §4.16 Optimism Mission Grants |
| Arbitrum One | 42161 | Round 2 A3 deploy — config ready, gas funding pending | §4.12 Arbitrum Foundation Grants |
| Linea | 59144 | Future — config not yet added to hardhat.config.js | §4.9 Linea Consortium Fund Identity Track |
| Mantle | 5000 | Future — config not yet added to hardhat.config.js | §4.7 Mantle Public Grants + Lightning Grants |

## Source generation note

Two source generations of `munity.sol` exist in the project history:

1. **Legacy bytecode** — what's actually live on Ethereum mainnet and Polygon PoS. Both Sourcify-verified Exact Match with their original source.
2. **Hardened vNext** — the source currently at [`contracts/munity.sol`](./contracts/munity.sol). Keeps the live `buy(uint256,uint256)` public shape but adds `ReentrancyGuard`, state-and-mint-effects-before-ETH-transfers, max platform fee cap, zero-amount purchase rejection, and cleaner deploy tooling. All new chain deployments (Base onwards) use this source.

This is an intentional, transparent distinction — not a discrepancy. Full explanation in [`deployments/README.md`](./deployments/README.md).

## Deployment Checklist (for a new chain)

1. `npm ci`
2. `npm test` — 9/9 must pass
3. Deploy from a dedicated deployer wallet (see `0x30af…04ef` in the Round 2 A3 pipeline)
4. Verify on the target explorer and Sourcify
5. Smoke test `name`, `symbol`, `owner`, `registerCommunity`, `buy`, `royaltyInfo`
6. Transfer ownership only after verification and smoke tests (deferred for A3; see `TRIPLE_L2_DEPLOY_HANDOFF_2026-05-26.md`)
7. Create `deployments/<chain-name>/` with `address.json` + `verification.md`
8. Add the new row to this file's live-deployments table + move the row out of "Pending Deployments"

