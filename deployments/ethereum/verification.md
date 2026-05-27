# Ethereum Mainnet — Verification

**Address:** [`0x55c31189539606D5b1Cb61d01D34E9180fca4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941)
**Chain ID:** 1
**Source generation:** legacy (pre-hardened) — see [`../README.md`](../README.md) for the source-vs-deployment note

## Verification proofs

| Authority | Status | URL |
|---|---|---|
| Sourcify | Exact Match | [`sourcify.dev/#/lookup/0x55c31189539606D5b1Cb61d01D34E9180fca4941`](https://sourcify.dev/#/lookup/0x55c31189539606D5b1Cb61d01D34E9180fca4941) |
| Etherscan | Source Code Verified | [`etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941#code`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941#code) |

## Compiler settings (per Sourcify metadata)

- **Solidity version:** `0.8.24`
- **EVM target:** `paris`
- **Optimizer:** disabled

## ABI

Available on the verified Etherscan page (Contract → ABI tab). Not bundled in this folder because the legacy source is not in this repo — only the hardened vNext source is.

## How to verify independently

```bash
# Anyone can confirm the verification status with:
curl -s "https://sourcify.dev/server/check-all-by-addresses?addresses=0x55c31189539606D5b1Cb61d01D34E9180fca4941&chainIds=1" | jq
```

Expected: `status: "perfect"` (Sourcify's term for Exact Match).
