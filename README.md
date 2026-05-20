# Munity EVM Smart Contract

This repository contains Munity's EVM community NFT contract work.

## Active project

- `smart-contracts/` - active EVM Hardhat project.
- `munity/` - legacy Solana/Anchor reference kept from the original Incubella import. It is not the current Munity Solana v2 program and should not be used as the Solana source of truth.

Current Solana v2 work lives in the separate Munity smart-contracts repository.

## Readiness

The active EVM contract is a hardened vNext source: ERC1155 + ERC2981 community keys, platform fee split, whitelist discounts, per-wallet mint limits, fee cap, and reentrancy protection.

See:

- `LICENSE` for the MIT license.
- `smart-contracts/README.md` for setup and commands.
- `smart-contracts/DEPLOYMENTS.md` for live deployed addresses and verification notes.
- `SECURITY.md` for disclosure and operational guidance.
