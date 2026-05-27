# Security Policy

## Reporting

Please report suspected vulnerabilities privately to `security@munity.club`.

Do not open a public issue with exploit details, private keys, API keys, or user data.

## Scope

In scope:

- `contracts/munity.sol`
- Deployment and verification scripts under `scripts/`
- Hardhat configuration in `hardhat.config.js`

Out of scope:

- Third-party RPC, wallet, explorer, or marketplace services

## Operational Notes

- Use a dedicated deployer wallet for new deployments.
- Transfer ownership only after contract verification and smoke tests.
- Never commit `.env` files or key material.
- The current EVM source has not been externally audited. Treat new deployments as unaudited until a third-party review is completed.

