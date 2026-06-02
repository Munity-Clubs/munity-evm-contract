# Deployments

Per-chain deployment records for the Munity EVM community NFT contract. Each chain has its own subdirectory with the deployed address, verification proofs, and metadata.

The canonical contract source is at [`contracts/munity.sol`](../contracts/munity.sol) (Solidity 0.8.24, optimizer disabled, EVM target `paris`).

## Chain status

| Chain | Chain ID | Address | Source | Verification | Folder |
|---|---|---|---|---|---|
| Ethereum mainnet | 1 | [`0x55c31189539606D5b1Cb61d01D34E9180fca4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941) | Legacy (pre-hardened) | Sourcify Exact Match · Etherscan ✓ | [`ethereum/`](./ethereum/) |
| Polygon PoS | 137 | [`0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) | Legacy (pre-hardened) | Sourcify Exact Match · Polygonscan ✓ | [`polygon/`](./polygon/) |
| Base | 8453 | [`0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083`](https://base.blockscout.com/address/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083) | Hardened vNext (this repo) | Sourcify Exact Match · Base Blockscout ✓ | [`base/`](./base/) |
| Optimism | 10 | *pending — Round 2 A3 deploy* | Hardened vNext (this repo) | *pending* | — |
| Arbitrum One | 42161 | *pending — Round 2 A3 deploy* | Hardened vNext (this repo) | *pending* | — |
| Linea | 59144 | *future — §4.9 grant pipeline* | Hardened vNext (this repo) | *pending* | — |
| Mantle | 5000 | *future — §4.7 grant pipeline* | Hardened vNext (this repo) | *pending* | — |

## Source-vs-deployment note

Two source generations of `munity.sol` exist:

1. **Legacy bytecode** — what's actually live on Ethereum mainnet and Polygon PoS. These deployments predate this repo's hardened source. Both are Sourcify-verified Exact Match with their original source, audited by their long live-history.
2. **Hardened vNext** — the source currently at [`contracts/munity.sol`](../contracts/munity.sol). Same public ABI shape for `buy(uint256,uint256)`, but adds `ReentrancyGuard`, state-and-mint-effects-before-ETH-transfers, max platform fee cap, zero-amount purchase rejection, and cleaner deploy tooling. All new chain deployments (Base, Optimism, Arbitrum One onwards) use this source.

This is an intentional, transparent distinction — not a discrepancy. The legacy chains keep their long-verified contracts; new chains get the hardened source. Both are open-source, MIT-licensed.

### EVM source-generation matrix

What's the same and what differs between the two EVM source generations:

| Property | Legacy (ETH `0x55c3…4941`, Polygon `0xaF02…08db`) | Hardened vNext (Base, Optimism, Arbitrum One, future) |
| --- | --- | --- |
| ERC1155 + ERC2981 standard compliance | ✅ | ✅ |
| `buy(uint256, uint256)` public ABI | ✅ | ✅ identical |
| Per-community: price, supply, URI | ✅ | ✅ |
| Address-list whitelist + per-community discount | ✅ | ✅ |
| 3.6% default platform fee, owner-adjustable | ✅ | ✅ |
| 3.5% creator royalty (ERC2981) | ✅ | ✅ |
| 50 NFT per-wallet cap per community | ✅ | ✅ |
| ReentrancyGuard on `buy()` | ❌ | ✅ |
| Checks-effects-interactions ordering | ❌ | ✅ |
| Max platform fee cap (10%) | ❌ | ✅ |
| Zero-amount purchase rejection | ❌ | ✅ |
| Sourcify Exact Match verification | ✅ | ✅ (post-deploy) |
| MIT license + open source | ✅ | ✅ |
| Solidity 0.8.24, optimizer off, EVM paris | ✅ | ✅ |

Functional difference: hardened vNext adds 4 safety improvements (ReentrancyGuard, CEI ordering, fee cap, zero-amount rejection). Behavioral surface for users + integrators is otherwise identical.

## Cross-VM feature parity (EVM vs Solana v2)

Munity runs on two virtual machines: EVM (this repo) and Solana (separate `Munity-Clubs/Solana-munity-smart-contract` repo, mainnet program [`4PeTcJYm5rPj4AU3Lq72nhpbyUxny2vJDTW6XUdpDDpk`](https://explorer.solana.com/address/4PeTcJYm5rPj4AU3Lq72nhpbyUxny2vJDTW6XUdpDDpk)). The two contracts deliberately have **different feature surfaces**, by design:

- **EVM**: minimal, audited, open-source NFT primitive — designed for portability across many EVM chains and for the simplest possible audit surface
- **Solana v2**: full-featured Munity app surface with USD-pegged pricing, multisig governance, and richer per-community gating

| Feature | EVM (all chains) | Solana v2 |
| --- | --- | --- |
| Per-community NFT primitive | ERC1155 token ID | Metaplex SPL collection |
| Per-community pricing + supply + URI | ✅ | ✅ |
| Whitelist | Address list (~250 gas per address) | Merkle proof (one proof per buy) |
| Per-community discount for whitelist | ✅ | ✅ |
| Multi-collection per community (gates Files / Roadmap / Merch) | ❌ | ✅ |
| Platform fee | 3.6% (owner-adjustable, capped 10%) | 4.5% (USD-pegged via Pyth oracle) |
| Creator/platform royalty split | 3.5% creator only (ERC2981) | 3.6% creator + 0.9% platform |
| Per-wallet mint cap | 50 NFTs per community | configurable per community |
| $MUNITY balance-staking fee discounts (DIAMOND/PLATINUM/EMERALD/OG/VETERAN/LOYALTY tiers) | ❌ | ✅ via wallet scan |
| Mint rebates in $MUNITY (fiat→crypto firewall) | ❌ | ✅ |
| USD-pegged pricing | ❌ (raw native units) | ✅ via Pyth |
| Governance | Single EOA owner (Ownable) | Squads 2/2 multisig |
| Reentrancy protection | ✅ (vNext); ❌ (legacy) | n/a (Solana sequential) |
| External audit status | Sec3 engagement letter on file 2026-05-20; quote pending | OtterSec attested 2026-05-22 (PDA `GTFGHc1oRs4nmsZQuPeRdPrgsQhihPVTGYihy9818z16`) |
| External adapters / SDKs | `@munityclubs/anchor-idl-compat`, `@munityclubs/nft-feature-gating`, `@munityclubs/verifiable-ticketing`, `@munityclubs/verifiable-token-transparency` (all MIT, npm) | same packages, both VMs supported |

### Why the two contracts are different (and that's a feature, not a bug)

EVM and Solana have different cost structures, different toolchains, different upgrade semantics. A single contract design that's optimal for both VMs doesn't exist. Munity's choice:

- **EVM is the cross-chain, audit-minimal, public-goods primitive.** Deploys to many L1/L2 chains; serves as the open-source reference NFT contract; minimal surface area means cheaper audits and easier multi-chain verification.
- **Solana v2 is the feature-rich app contract.** Single-program model, single audit (OtterSec done), multisig-controlled, richer gating + economics + tokenomics.

A grant reviewer checking a Base or Arbitrum deployment for "multi-collection gating" will not find it — that lives in the Solana v2 program. This is intentional and documented. Cross-chain feature parity is **not** a Munity design goal; cross-chain *NFT-primitive availability* is.

For features that need to work across both VMs (NFT-gated access, ticketing, transparency), the `@munityclubs/*` npm packages handle the VM abstraction at the integration layer.

## Per-chain folder contents

Each `deployments/<chain>/` folder contains:

- **`address.json`** — machine-readable metadata: chain ID, address, deployer, deploy tx hash, deploy block, compiler settings, source generation (legacy vs hardened vNext)
- **`verification.md`** — human-readable verification proofs: links to Sourcify and the chain's block explorer, with attestation status

For chains with the hardened vNext source, the ABI is at [`../contracts/munity.sol`](../contracts/munity.sol) (or built artifacts at `artifacts/contracts/munity.sol/Munity.json` after `npx hardhat compile`). The legacy ETH + Polygon ABIs are available on their respective verified explorer pages (linked from each chain's `verification.md`).
