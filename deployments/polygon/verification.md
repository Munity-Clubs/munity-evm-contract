# Polygon PoS — Verification

**Address:** [`0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db)
**Chain ID:** 137
**Source generation:** legacy (pre-hardened) — see [`../README.md`](../README.md) for the source-vs-deployment note

## Verification proofs

| Authority | Status | URL |
|---|---|---|
| Sourcify | Exact Match | [`sourcify.dev/#/lookup/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db`](https://sourcify.dev/#/lookup/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) |
| Polygonscan | Source Code Verified | [`polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db#code`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db#code) |

## Compiler settings (per Sourcify metadata)

- **Solidity version:** `0.8.24`
- **EVM target:** `paris`
- **Optimizer:** disabled

## ABI

Available on the verified Polygonscan page (Contract → ABI tab). Not bundled in this folder because the legacy source is not in this repo — only the hardened vNext source is.

## How to verify independently

```bash
# Anyone can confirm the verification status with:
curl -s "https://sourcify.dev/server/check-all-by-addresses?addresses=0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db&chainIds=137" | jq
```

Expected: `status: "perfect"` (Sourcify's term for Exact Match).
