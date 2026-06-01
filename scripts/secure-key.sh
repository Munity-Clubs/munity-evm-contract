#!/usr/bin/env bash
# Interactive PRIVATE_KEY loader for the Munity EVM deploy session.
#
# Purpose: load the deployer private key into the current shell session ONLY.
# The key never touches disk, never enters .env, never enters shell history.
# When the shell session ends, the key is gone.
#
# USAGE — must be SOURCED, not executed:
#   source ./scripts/secure-key.sh
#
# After sourcing, PRIVATE_KEY is exported into your shell. Hardhat picks it
# up via process.env.PRIVATE_KEY (hardhat.config.js handles the 0x prefix).
# Every npm run deploy:* in this shell session uses the same loaded key.

# Refuse to execute (must be sourced — otherwise the exported var disappears
# when the subshell exits).
if [ "${BASH_SOURCE[0]}" = "${0}" ] 2>/dev/null; then
  echo "ERROR: this script must be sourced, not executed." >&2
  echo "  source ./scripts/secure-key.sh" >&2
  exit 1
fi

# Read key silently (no echo, no shell history)
read -rsp 'Deployer private key (input hidden): ' _PK
echo

if [ -z "$_PK" ]; then
  echo "Aborted — empty input." >&2
  unset _PK
  return 1
fi

# Trim whitespace
_PK="${_PK#"${_PK%%[![:space:]]*}"}"
_PK="${_PK%"${_PK##*[![:space:]]}"}"

# Length sanity (raw hex = 64; with 0x prefix = 66)
PK_LEN=${#_PK}
if [ "$PK_LEN" -ne 64 ] && [ "$PK_LEN" -ne 66 ]; then
  echo "WARNING: key length is $PK_LEN — expected 64 (raw hex) or 66 (with 0x prefix)." >&2
  echo "  Aborting. Re-source and try again." >&2
  unset _PK
  return 1
fi

export PRIVATE_KEY="$_PK"
unset _PK

# Verify the key derives the expected deployer address.
EXPECTED_DEPLOYER="0x30afF336B1a5A1F43Bf8a79BAb7Af67DaCD804ef"
if [ -f node_modules/ethers/package.json ]; then
  DERIVED=$(node -e '
    const {Wallet} = require("ethers");
    const pk = process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY : "0x" + process.env.PRIVATE_KEY;
    try { console.log(new Wallet(pk).address); } catch (e) { console.error(e.message); process.exit(1); }
  ' 2>&1)

  if [ -z "$DERIVED" ] || [[ "$DERIVED" == *"error"* ]] || [[ "$DERIVED" == *"Error"* ]]; then
    echo "ERROR: could not derive address from loaded key — likely an invalid private key." >&2
    echo "  ethers said: $DERIVED" >&2
    unset PRIVATE_KEY
    return 1
  fi

  # Case-insensitive compare (checksum vs lowercase)
  if [ "$(echo "$DERIVED" | tr '[:upper:]' '[:lower:]')" = "$(echo "$EXPECTED_DEPLOYER" | tr '[:upper:]' '[:lower:]')" ]; then
    echo "✅ PRIVATE_KEY loaded. Derived address matches expected deployer: $DERIVED"
  else
    echo "🚨 MISMATCH: derived $DERIVED but expected $EXPECTED_DEPLOYER" >&2
    echo "  This is NOT the Munity A3 deployer wallet. Unloading key." >&2
    unset PRIVATE_KEY
    return 1
  fi
else
  echo "⚠️ ethers not found in node_modules — skipping address verification."
  echo "  Run 'npm ci' first, then re-source this script to verify the key."
  echo "  (PRIVATE_KEY is loaded, but you should verify before deploying.)"
fi
