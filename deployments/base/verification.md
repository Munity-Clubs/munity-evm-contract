# Base — Verification

**Address:** [`0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083`](https://base.blockscout.com/address/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083)
**Chain ID:** 8453
**Source generation:** hardened vNext (this repo) — see [`../README.md`](../README.md) for the source-vs-deployment note

## Verification proofs

| Authority | Status | URL |
|---|---|---|
| Sourcify | Exact Match (runtime + creation) | [`sourcify.dev/#/lookup/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083`](https://sourcify.dev/#/lookup/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083) |
| Base Blockscout | Source Code Verified | [`base.blockscout.com/address/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083#code`](https://base.blockscout.com/address/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083#code) |

## Deployment

- **Deployer:** [`0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef`](https://base.blockscout.com/address/0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef) (remains `owner()`)
- **Deploy tx:** [`0xc903728bf3990e796cdb7bd676962cbcfac33e751fe07054955097a546443439`](https://base.blockscout.com/tx/0xc903728bf3990e796cdb7bd676962cbcfac33e751fe07054955097a546443439)
- **Block:** 46814689
- **Timestamp:** 2026-06-02T16:45:25Z

## Compiler settings (per Sourcify metadata)

- **Solidity version:** `0.8.24` (`0.8.24+commit.e11b9ed9`)
- **EVM target:** `paris`
- **Optimizer:** disabled

## ABI

Bundled alongside this record at [`./abi.json`](./abi.json) (the canonical Hardhat artifact for `contracts/munity.sol`, frozen to this deployment). The same ABI is exposed on the verified Blockscout page (Contract → ABI) and via Sourcify.

## On-chain smoke checks (read-only, confirmed at deploy)

- `name()` → `Munity`
- `symbol()` → `MU`
- `owner()` → `0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef`
- `supportsInterface(0xd9b67a26)` (ERC1155) → `true`
- `supportsInterface(0x2a55205a)` (ERC2981) → `true`

## How to verify independently

```bash
# Sourcify v2 (v1 API is in a scheduled brownout window as of deploy day):
curl -s "https://sourcify.dev/server/v2/contract/8453/0x6c60642F9e6c4C203ae984c34C0a10D77c3f2083" | jq
```

Expected: `"match": "exact_match"` with both `runtimeMatch` and `creationMatch` reported as `exact_match`.
