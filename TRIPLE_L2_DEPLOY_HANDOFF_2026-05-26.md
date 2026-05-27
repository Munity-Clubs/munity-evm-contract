# Triple L2 Deploy — Execution Handoff

> **Created:** 2026-05-26.
> **Audience:** A fresh Claude Code chat opened with this EVM repo as primary working directory.
> **Status:** Not started. Pre-session funding gate not yet confirmed.
> **Estimated effort:** 4–6h dev/ops in this repo (excludes the four grant drafts that piggyback on each deploy — those happen in the Munity webapp repo).

---

## How this doc fits

Two-doc system for Round 2 A3:

1. **THIS doc** (this file, in the EVM repo) — deploy mechanics: pre-flight, testnet rehearsal, mainnet deploy, verification, `DEPLOYMENTS.md` update.
2. **Companion doc** in the Munity webapp repo at `docs/grants/A3_TRIPLE_L2_HANDOFF_2026-05-25.md` (full path: `/Users/mind/Documents/mindmac/Work Space/Projects/MUNITY/MUNITY VSCODE REPO/munity-full-stack/fullstack-/docs/grants/A3_TRIPLE_L2_HANDOFF_2026-05-25.md`) — grants narrative: four grant drafts (Base Builder, Coinbase Onchain Summer, Optimism Mission, Arbitrum Foundation) that consume each deploy as proof, plus master-tracker A3 row updates.

The split exists so a fresh chat opened in this EVM repo doesn't need cross-workspace context to do on-chain work. After each mainnet deploy verifies, hand off to a webapp-repo session for the matching grant draft.

---

## ⛔ Hard rules (re-read before any action)

1. **NEVER run `git commit`.** Tool-level deny is in `~/.claude/settings.json`. Stage with `git add` only; user runs commits. "Proceed" / "continue" / "next step" do NOT authorize commits.
2. **Git author must be `kid of the north <security@munity.club>`** — NOT `9diamondmind@proton.me`. If `git config user.email` shows the proton address, FLAG to user; do NOT auto-fix (system prompt forbids `git config` writes without explicit OK).
3. **NO `Co-Authored-By` trailers, NO "Generated with Claude Code" trailers** on commits or PRs.
4. **Stage per author.** Never bundle other agents' untracked work into your stage.
5. **Deploys are user-driven, not autonomous.** You can prepare scripts, verify configs, write docs, and stage updates. You CANNOT broadcast a mainnet deploy transaction without explicit per-action OK. Each L2 mainnet deploy is a separate explicit "go" — never chain three off one approval.

---

## Locked-in answers (settled 2026-05-26 by user)

| # | Decision | Value |
|---|---|---|
| 1 | Deploy wallet | `0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef` (existing EVM signer) |
| 2 | Funding strategy | User pre-funds all three L2 mainnets + their sepolias up-front before fresh chat starts. You do NOT initiate funding. |
| 3 | Ownership transfer | **SKIP for A3.** Deployer EOA (`0x30af…04ef`) stays as `owner()` on all new L2 contracts. `transferOwnership` is NOT a deploy step. Ownership target is a deferred decision — track as follow-on, do not block A3 on it. |
| 4 | Optimizer setting | Keep `optimizer.enabled: false` in `hardhat.config.js`. Matches live ETH/Polygon source for Sourcify Exact Match. |
| 5 | Deploy order | Base mainnet (8453) → Optimism mainnet (10) → Arbitrum One (42161). Base first = cleanest Coinbase Onchain Summer fit. |
| 6 | Testnet rehearsals | All three: Base Sepolia → Optimism Sepolia → Arbitrum Sepolia, each before its matching mainnet. |
| 7 | Webapp wiring | **Out of scope for A3.** After each mainnet deploy verifies, update `DEPLOYMENTS.md` ONLY. Do NOT touch the webapp's `src/utils/web3/addresses.js`, `MUNITY_CONFIG`, or any frontend file. Webapp integration is a separate user-gated task. |

---

## Ground truth (verified 2026-05-26 — re-verify before acting)

### Source repo

- **Local path:** `/Users/mind/Documents/mindmac/Work Space/Projects/MUNITY/MUNITY VSCODE REPO/evm-munity-contract/`
- **GitHub remote:** `https://github.com/Munity-Clubs/evm-munity-smart-contract` *(GitHub repo name uses the longer `-smart-contract` form; local clone uses the shorter `-contract` form — verify with `git remote -v` before any push work)*
- **License:** MIT (root `LICENSE`)
- **Solidity:** 0.8.24, optimizer OFF, EVM target `paris`
- **Contract source:** `contracts/munity.sol`
- **Constructor:** zero-arg — `constructor() ERC1155("") Ownable(_msgSender())`. Deployer becomes `owner()`.
- **Live `buy()` signature:** `buy(uint256 _id, uint256 _amount)` (matches verified live ETH/Polygon).
- **Deploy script:** `scripts/deploy.js` — passes `constructorArguments: []` to `verify:verify`.
- **Tests:** 9 passing Hardhat tests in `test/munity.test.js`.

### Live deployments — DO NOT TOUCH

| Chain | Chain ID | Address | Verification |
|---|---|---|---|
| Ethereum mainnet | 1 | [`0x55c31189539606D5b1Cb61d01D34E9180fca4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941) | Sourcify Exact Match, Solidity 0.8.24 |
| Polygon PoS | 137 | [`0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) | Sourcify Exact Match, Solidity 0.8.24 |

Authoritative ledger: `DEPLOYMENTS.md`. These two are the *legacy* compiled bytecode — A3 deploys use the *current hardened source* in this repo. Per grant drafts, flag this distinction explicitly: "same public ABI, same Solidity version, hardened source diff from legacy."

### Target chains

| Chain | Chain ID | Mainnet RPC env | Testnet env | Explorer | Verifier env |
|---|---|---|---|---|---|
| Base | 8453 | `ALCHEMY_API_BASE` | `ALCHEMY_API_BASE_SEPOLIA` | [basescan.org](https://basescan.org/) | `BASESCAN_API_KEY` |
| Optimism | 10 | `ALCHEMY_API_OPT` | `ALCHEMY_API_OPT_SEPOLIA` | [optimistic.etherscan.io](https://optimistic.etherscan.io/) | `OPTIMISTIC_ETHERSCAN_API_KEY` |
| Arbitrum One | 42161 | `ALCHEMY_API_ARB` | `ALCHEMY_API_ARB_SEPOLIA` | [arbiscan.io](https://arbiscan.io/) | `ARBISCAN_API_KEY` |

All three are Sourcify-supported. `chainlist.org` already lists them — no chain-registry PR needed.

Hardhat network names in `hardhat.config.js`: `base`, `baseSepolia`, `optimism`, `optimismSepolia`, `arbitrum`, `arbitrumSepolia`.

---

## Pre-session prerequisites (user must do these BEFORE fresh chat starts)

- [ ] Fund `0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef` on Base mainnet (~$3-5 worth of ETH)
- [ ] Fund same wallet on Optimism mainnet (~$3-5 ETH)
- [ ] Fund same wallet on Arbitrum One (~$3-5 ETH)
- [ ] Fund same wallet on Base Sepolia (faucet, free)
- [ ] Fund same wallet on Optimism Sepolia (faucet, free)
- [ ] Fund same wallet on Arbitrum Sepolia (faucet, free)
- [ ] Confirm `.env` is populated:
  - `PRIVATE_KEY` for the deployer wallet
  - `ALCHEMY_API_BASE`, `ALCHEMY_API_OPT`, `ALCHEMY_API_ARB` (mainnet RPC keys)
  - `ALCHEMY_API_BASE_SEPOLIA`, `ALCHEMY_API_OPT_SEPOLIA`, `ALCHEMY_API_ARB_SEPOLIA` (testnet)
  - `BASESCAN_API_KEY`, `OPTIMISTIC_ETHERSCAN_API_KEY`, `ARBISCAN_API_KEY` (verification)

Reference canonical variable list: `.env.example`.

The fresh chat should confirm funding + env-var presence as its first sanity check; do NOT auto-proceed if any are missing.

---

## Pre-flight (run once at session start, before any deploy)

```bash
npm ci
npx hardhat test                                              # 9 tests must pass
npx hardhat compile                                            # ensure clean compile
shasum -a 256 artifacts/contracts/munity.sol/Munity.json       # record bytecode hash for traceability
git remote -v                                                  # confirm GitHub remote URL
git status                                                     # working tree clean before deploy
git config user.email                                          # MUST be security@munity.club; if proton.me, FLAG to user
```

If any of these fail or the bytecode hash differs from a prior known-good run, STOP and surface to user.

---

## Per-chain deploy sequence

Run for **Base → Optimism → Arbitrum One** in that order. Do NOT parallelize. Each chain is a full pass through Steps A→G before starting the next chain.

### Step A — Testnet rehearsal

```bash
# Replace <testnet> with: baseSepolia | optimismSepolia | arbitrumSepolia
VERIFY=true npx hardhat run scripts/deploy.js --network <testnet>
```

- Capture the deployed address from console output.
- Wait for the `verify:verify` confirmation message.
- Smoke-test on the testnet:
  - `name()`, `symbol()`, `owner()` — owner must be `0x30af…04ef`
  - `registerCommunity(...)` with a dummy ID + price + supply (use the test wallet's funds)
  - `buy(id, 1)` with `value` matching the registered price
  - `balanceOf(buyer, id)` to confirm mint
  - `royaltyInfo(id, salePrice)` to confirm ERC2981 returns receiver + bps
- Append testnet address + tx hash + verification URL under a new "Testnet Rehearsals" section in `DEPLOYMENTS.md`.
- Stage with `git add DEPLOYMENTS.md`. Do NOT commit.

### Step B — Pause + ask user for mainnet OK

Do NOT auto-proceed to mainnet. Wait for explicit user authorization for THIS chain (e.g., "deploy Base mainnet now"). Per-chain OK only — never chain into the next L2's mainnet deploy.

### Step C — Mainnet deploy

```bash
# Replace <mainnet> with: base | optimism | arbitrum
VERIFY=true npx hardhat run scripts/deploy.js --network <mainnet>
```

- Capture deployer-tx hash + deployed contract address.
- The script waits `VERIFY_CONFIRMATIONS` blocks (default 5) before calling `verify:verify` — auto-handled.
- Auto-verification submits to both the chain's Etherscan-family explorer AND Sourcify.

### Step D — Verification confirmation

- Open the explorer URL: `https://<explorer>/address/<deployed_address>#code`
- Confirm "Verified" / "Exact Match" status renders the source.
- Visit `https://sourcify.dev/#/lookup/<deployed_address>` and confirm chain match.
- If auto-verification did NOT complete, run:
  ```bash
    npx hardhat verify --network <mainnet> <deployed_address>
  ```

### Step E — Mainnet smoke test

Read-only checks first (free):
- `name()`, `symbol()`, `owner()` — owner MUST be `0x30af…04ef`
- Contract source matches what's in the repo (visual diff on explorer)

If user explicitly OKs a paid smoke test (~$0.01-0.10 on L2):
- `registerCommunity(...)` with a real dummy community
- `buy(id, 1)` with matching `value`
- `balanceOf` confirms mint
- `royaltyInfo` confirms ERC2981

Do NOT run paid smoke tests without per-chain user OK.

### Step F — `DEPLOYMENTS.md` update

Append a new row to the "Live Production Contracts" table:

```markdown
| Base mainnet | `0x<address>` | Sourcify Exact Match, BaseScan verified | Hardened vNext, deployed YYYY-MM-DD by 0x30af…04ef |
```

Add a deployment-detail block below the table with:
- Deployer address
- Deploy transaction hash
- Block number
- Verification URLs (explorer + Sourcify)
- Bytecode hash (from pre-flight `shasum`)

Stage with `git add DEPLOYMENTS.md`. Do NOT commit — surface a commit-ready summary to user and let them run the commit.

### Step G — Hand off to webapp repo for grant draft

After this chain's mainnet verifies and `DEPLOYMENTS.md` is staged, the matching grant draft is written in the webapp repo per `docs/grants/A3_TRIPLE_L2_HANDOFF_2026-05-25.md`. Two options:

- **Same chat continues into webapp work** (acceptable if context budget allows) — switch focus to `/Users/mind/Documents/mindmac/Work Space/Projects/MUNITY/MUNITY VSCODE REPO/munity-full-stack/fullstack-/` and read the A3 doc.
- **Fresh chat for drafts** (preferred for clean context separation) — leave a marker in `docs/grants/ROUND_1.5_TO_R2_MASTER_2026-05-23.md` (webapp repo) noting the verified address, and tell user to start a new chat in the webapp repo for the draft work.

Then loop back to Step A for the next chain.

---

## Files this session may modify

Whitelist:
- `DEPLOYMENTS.md` — testnet rehearsals + mainnet rows
- `.env` — local only, gitignored, no commits

DO NOT touch:
- `contracts/munity.sol` — source is locked for this deploy series
- `scripts/deploy.js` — deploy script is locked
- `hardhat.config.js` — network config is locked (optimizer stays off)
- `test/munity.test.js` — tests are locked
- `package.json` / `package-lock.json` — deps are pinned
- `HANDOFF.md` (top-level) — orientation doc, not deploy-specific
- Any file outside `DEPLOYMENTS.md`

If you find yourself wanting to modify any locked file, STOP and surface to user. Source/config drift mid-deploy-series breaks the "same hardened source across all 5 chains" grants narrative.

---

## Deferred decisions (do NOT resolve in this session)

- **Ownership target.** `0x30af…04ef` remains `owner()` on all new L2 deployments. Future question: should ownership migrate to a treasury wallet (`0x6f62…328d` per grant master plan), a multisig, or stay EOA? Not blocking A3. Track as a follow-on.
- **Webapp wiring timing.** When (if) `src/utils/web3/addresses.js` + `MUNITY_CONFIG` in the Munity webapp should pick up the new L2 addresses. Out of A3 scope. Separate user-gated task.
- **L2 expansion beyond Base/OP/Arb.** Mantle, Linea, Scroll, zkSync, etc. Not in current grants pipeline. Out of A3 scope.
- **Optimizer-on variant.** Whether to ever deploy an `optimizer.enabled: true` variant for L2-only gas efficiency. Currently NO — source consistency wins. Revisit only if a specific grant requires it.

---

## Companion docs cross-reference

| Doc | Location | Purpose |
|---|---|---|
| THIS file | `evm-munity-contract/TRIPLE_L2_DEPLOY_HANDOFF_2026-05-26.md` | Deploy mechanics, locked answers, hard rules |
| HANDOFF.md | `evm-munity-contract/HANDOFF.md` | General repo orientation (audience: collaborators, auditors, grant reviewers) |
| DEPLOYMENTS.md | `evm-munity-contract/DEPLOYMENTS.md` | Canonical deployment ledger (gets appended after each deploy) |
| A3 grants handoff | `munity-full-stack/fullstack-/docs/grants/A3_TRIPLE_L2_HANDOFF_2026-05-25.md` | Grant draft templates + master-tracker integration |
| Master tracker | `munity-full-stack/fullstack-/docs/grants/ROUND_1.5_TO_R2_MASTER_2026-05-23.md` | Round 2 progress checklist — A3 rows live there |

---

## Fresh-chat boot prompt

Paste this verbatim into the new Claude Code chat opened with this EVM repo as working directory:

````
Continuing Munity grants execution — Round 2 A3 Triple L2 deploy.
This chat does the on-chain deploy work in the EVM contract repo.

Working directory: /Users/mind/Documents/mindmac/Work Space/Projects/MUNITY/MUNITY VSCODE REPO/evm-munity-contract/

Read these files first, in this order:
  1. TRIPLE_L2_DEPLOY_HANDOFF_2026-05-26.md (this repo) — deploy mechanics, locked answers, hard rules
  2. HANDOFF.md (this repo) — general orientation
  3. DEPLOYMENTS.md — current deployment ledger

Then read for grant-narrative context (cross-workspace):
  4. /Users/mind/Documents/mindmac/Work Space/Projects/MUNITY/MUNITY VSCODE REPO/munity-full-stack/fullstack-/docs/grants/A3_TRIPLE_L2_HANDOFF_2026-05-25.md

⛔ HARD RULES (re-verify before any action):
  - NEVER run `git commit` (tool-level denied). Stage with `git add` only.
  - Git author = kid of the north <security@munity.club>. If git config shows
    9diamondmind@proton.me, FLAG to user; do NOT auto-fix.
  - NO Co-Authored-By or "Generated with Claude Code" trailers.
  - Stage per author. Never bundle other agents' work.
  - Deploys are user-driven. Prepare + verify + stage; do NOT broadcast a
    mainnet deploy without explicit per-chain OK. Each L2 mainnet is its
    own "go" — never chain three off one OK.

Locked answers (settled 2026-05-26):
  Deploy wallet:        0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef
  Funding:              user pre-funded all three L2 mainnets + sepolias
  Ownership:            deployer EOA stays as owner; NO transferOwnership in A3
  Optimizer:            keep OFF (matches live ETH/Polygon source)
  Deploy order:         Base → Optimism → Arbitrum One
  Testnet rehearsals:   all three sepolias before each matching mainnet
  Webapp wiring:        OUT OF SCOPE — DEPLOYMENTS.md only this session

Ground truth (verified 2026-05-26):
  Source: contracts/munity.sol, Solidity 0.8.24, optimizer OFF
  Constructor: zero-arg, deployer becomes owner
  buy() signature: buy(uint256 _id, uint256 _amount) — matches live
  Tests: 9 passing Hardhat tests
  Live (DO NOT TOUCH): Ethereum 0x55c3…4941, Polygon 0xaF02…08db
  Targets: Base 8453, Optimism 10, Arbitrum One 42161
  All three Sourcify-supported

First action:
  npm ci && npx hardhat test && npx hardhat compile
  Then: shasum -a 256 artifacts/contracts/munity.sol/Munity.json (record hash)
  Then: git remote -v && git status && git config user.email
  Report pre-flight results. Do NOT proceed past pre-flight without user OK.
  Confirm user has pre-funded the three L2 mainnets + three sepolias before
  asking for the first deploy OK.
````
