# Deployments

Per-chain deployment records for the Munity EVM community NFT contract. Each chain has its own subdirectory with the deployed address, verification proofs, and metadata.

The canonical contract source is at [`contracts/munity.sol`](../contracts/munity.sol) (Solidity 0.8.24, optimizer disabled, EVM target `paris`).

## Chain status

| Chain | Chain ID | Address | Source | Verification | Folder |
|---|---|---|---|---|---|
| Ethereum mainnet | 1 | [`0x55c31189539606D5b1Cb61d01D34E9180fca4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941) | Legacy (pre-hardened) | Sourcify Exact Match · Etherscan ✓ | [`ethereum/`](./ethereum/) |
| Polygon PoS | 137 | [`0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) | Legacy (pre-hardened) | Sourcify Exact Match · Polygonscan ✓ | [`polygon/`](./polygon/) |
| Base | 8453 | *pending — Round 2 A3 deploy* | Hardened vNext (this repo) | *pending* | — |
| Optimism | 10 | *pending — Round 2 A3 deploy* | Hardened vNext (this repo) | *pending* | — |
| Arbitrum One | 42161 | *pending — Round 2 A3 deploy* | Hardened vNext (this repo) | *pending* | — |
| Linea | 59144 | *future — §4.9 grant pipeline* | Hardened vNext (this repo) | *pending* | — |
| Mantle | 5000 | *future — §4.7 grant pipeline* | Hardened vNext (this repo) | *pending* | — |

## Source-vs-deployment note

Two source generations of `munity.sol` exist:

1. **Legacy bytecode** — what's actually live on Ethereum mainnet and Polygon PoS. These deployments predate this repo's hardened source. Both are Sourcify-verified Exact Match with their original source, audited by their long live-history.
2. **Hardened vNext** — the source currently at [`contracts/munity.sol`](../contracts/munity.sol). Same public ABI shape for `buy(uint256,uint256)`, but adds `ReentrancyGuard`, state-and-mint-effects-before-ETH-transfers, max platform fee cap, zero-amount purchase rejection, and cleaner deploy tooling. All new chain deployments (Base, Optimism, Arbitrum One onwards) use this source.

This is an intentional, transparent distinction — not a discrepancy. The legacy chains keep their long-verified contracts; new chains get the hardened source. Both are open-source, MIT-licensed.

## Per-chain folder contents

Each `deployments/<chain>/` folder contains:

- **`address.json`** — machine-readable metadata: chain ID, address, deployer, deploy tx hash, deploy block, compiler settings, source generation (legacy vs hardened vNext)
- **`verification.md`** — human-readable verification proofs: links to Sourcify and the chain's block explorer, with attestation status

For chains with the hardened vNext source, the ABI is at [`../contracts/munity.sol`](../contracts/munity.sol) (or built artifacts at `artifacts/contracts/munity.sol/Munity.json` after `npx hardhat compile`). The legacy ETH + Polygon ABIs are available on their respective verified explorer pages (linked from each chain's `verification.md`).
