# Munity EVM Smart Contract

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)
[![Verified: Ethereum](https://img.shields.io/badge/Ethereum-Sourcify%20Exact%20Match-green?style=flat-square)](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941)
[![Verified: Polygon](https://img.shields.io/badge/Polygon-Sourcify%20Exact%20Match-green?style=flat-square)](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db)
[![Security Policy](https://img.shields.io/badge/security-policy-blue?style=flat-square)](./SECURITY.md)
[![Handoff](https://img.shields.io/badge/handoff-doc-green?style=flat-square)](./HANDOFF.md)

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
