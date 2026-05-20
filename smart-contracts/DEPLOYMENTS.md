# Deployments

## Live Production Contracts

These are the currently known production EVM deployments used by the Munity app.

| Chain | Address | Verification | Notes |
| --- | --- | --- | --- |
| Ethereum mainnet | `0x55c31189539606D5b1Cb61d01D34E9180fca4941` | Sourcify exact match, Etherscan verified | Live legacy ERC1155 + ERC2981 contract |
| Polygon PoS | `0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db` | Sourcify exact match, Polygonscan verified | Live legacy ERC1155 + ERC2981 contract |

Both live contracts expose `buy(uint256 _id, uint256 _amount)`.

## This Repository

`contracts/munity.sol` is a hardened vNext source. It keeps the live public API shape for `buy(uint256,uint256)`, but it is not byte-for-byte identical to the live deployments because it adds:

- `ReentrancyGuard`
- state and mint effects before ETH transfers
- a maximum platform fee cap
- zero-amount purchase rejection
- cleaner deploy and verification tooling

Deploy this source to a new address before wiring it into production. Do not point the app to this source until the new deployment address, verified ABI, and smoke tests are recorded here.

## Deployment Checklist

1. Run `npm ci`.
2. Run `npm test`.
3. Deploy from a dedicated deployer wallet.
4. Verify on the target explorer and Sourcify.
5. Smoke test `name`, `symbol`, `registerCommunity`, `buy`, `royaltyInfo`, and `getCommunityDetails`.
6. Transfer ownership only after verification and smoke tests.
7. Add the new address, chain ID, transaction hash, and verification links to this file.

