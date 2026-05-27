# Handoff — Munity EVM Smart Contract

> One-page orientation for anyone landing on this repo cold: a new collaborator, a code auditor, a grant reviewer, or future-you after a long context switch.

## What this is

The Munity EVM community NFT contract: an ERC-1155 + ERC-2981 contract serving as the EVM rail for Munity Clubs across multiple EVM chains. One canonical Solidity source, deployed to every supported chain — same audit surface everywhere.

By design, this is a **minimal NFT primitive**, not the full Munity app surface. It implements per-community pricing, supply, whitelist + discount, platform fee split, and per-wallet mint limits. Features that need richer state (multi-collection-per-community gating, $MUNITY balance-tier discounts, USD-pegged pricing, multisig governance) live in the separate Solana v2 program — that's intentional, see [`deployments/README.md`](./deployments/README.md) "Cross-VM feature parity" for the full breakdown.

Hardened vNext source adds 4 safety improvements over the legacy ETH + Polygon deployments: ReentrancyGuard on `buy()`, checks-effects-interactions ordering, max platform fee cap (10%), and zero-amount purchase rejection. Public ABI is unchanged.

## Current state (2026-05-26)

- **Source location:** `contracts/munity.sol`
- **License:** MIT (see `LICENSE`)
- **Compiler:** Solidity 0.8.24
- **Deployment standard:** ERC-1155 + ERC-2981 (royalty)
- **Verification:** Sourcify Exact Match on both Ethereum mainnet and Polygon PoS
- **Stability:** Live contract is stable. Both deployments are operational and used by every Munity Club on EVM.
- **Experimental:** none in current source.
- **Open work:** Active L2 expansion (Base 8453, Optimism 10, Arbitrum One 42161) under Round 2 A3 of the Munity grant pipeline. Same hardened vNext source — see `TRIPLE_L2_DEPLOY_HANDOFF_2026-05-26.md` for deploy mechanics.

## How it fits the Munity stack

- **Munity webapp** uses the deployed addresses through `src/utils/web3/addresses.js`, `src/utils/web3/chains.js`, and `src/utils/abis/erc1155Munity.js`.
- **Wallet support** is via RainbowKit + wagmi (`src/context/RinbowkitWagmiContext.js`).
- **Feature-gating** uses `@munityclubs/nft-feature-gating` against ownership reads (`balanceOf`) from this contract.
- **Ticketing** uses `@munityclubs/verifiable-ticketing` for QR + scanner-side verification of tickets minted through this contract.

## Where it's deployed

| Chain | Address | Verification |
|---|---|---|
| Ethereum mainnet | [`0x55c31189539606D5b1Cb61d01D34E9180fca4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941) | Sourcify Exact Match, Solidity 0.8.24 |
| Polygon PoS | [`0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) | Sourcify Exact Match, Solidity 0.8.24 |

See [`DEPLOYMENTS.md`](./DEPLOYMENTS.md) for the canonical deployment register.

## How to verify

```bash
npm ci
npx hardhat compile
# Sourcify proof:
#   - Ethereum: https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941#code
#   - Polygon:  https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db#code
```

Source folder layout:
- `contracts/` — Solidity sources (`munity.sol` + `test/` helpers)
- `scripts/` — deploy + verification scripts
- `test/` — Hardhat tests
- `hardhat.config.js` — networks + verifier config

Current Solana v2 work lives in the separate [`Munity-Clubs/Solana-munity-smart-contract`](https://github.com/Munity-Clubs/Solana-munity-smart-contract) repository — not in this repo.

## Roadmap pointer

L2 expansion (Base 8453, Optimism 10, Arbitrum One 42161) is scoped under Munity grant pipeline Round 2 item A3 — same verified bytecode, three additional registry passes. Tracked in [`docs/grants/ROUND_1.5_TO_R2_MASTER_2026-05-23.md`](https://github.com/kidofthenorth/munity-full-stack/blob/final-merge/docs/grants/ROUND_1.5_TO_R2_MASTER_2026-05-23.md) in the Munity webapp repo.

## Security + disclosure

- See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting policy and in-scope surface.
- The current EVM source has not been externally audited. Treat new deployments as unaudited until a third-party review is completed.
- Contact: `security@munity.club`
- RFC 9116: [`munity.club/.well-known/security.txt`](https://munity.club/.well-known/security.txt)
- Sec3 third-party audit engagement letter on file 2026-05-20 (scope: companion `@munityclubs/*` packages).