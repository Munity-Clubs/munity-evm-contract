require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("hardhat-contract-sizer");
require("dotenv").config({ path: __dirname + "/.env" });

function withHexPrefix(value) {
  if (!value) return undefined;
  return value.startsWith("0x") ? value : `0x${value}`;
}

const privateKey = withHexPrefix(process.env.PRIVATE_KEY);
const accounts = privateKey ? [privateKey] : [];

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      forking: process.env.FORK_URL ? { url: process.env.FORK_URL } : undefined,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_SEPOLIA || ""}`,
      chainId: 11155111,
      accounts,
    },
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_AMOY || ""}`,
      chainId: 80002,
      accounts,
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_MAINNET || ""}`,
      chainId: 1,
      accounts,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_POLYGON || ""}`,
      chainId: 137,
      accounts,
    },
    baseSepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE_SEPOLIA || ""}`,
      chainId: 84532,
      accounts,
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE || ""}`,
      chainId: 8453,
      accounts,
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_OPT_SEPOLIA || ""}`,
      chainId: 11155420,
      accounts,
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_OPT || ""}`,
      chainId: 10,
      accounts,
    },
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_ARB_SEPOLIA || ""}`,
      chainId: 421614,
      accounts,
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_ARB || ""}`,
      chainId: 42161,
      accounts,
    },
  },
  // Verification config — Blockscout for A3 L2 chains (Base/OP/Arb),
  // Etherscan-family kept for ETH + Polygon (legacy chains, not part of A3).
  // hardhat-verify 2.x uses the `etherscan` block name even when pointing at
  // Blockscout — Blockscout's API is Etherscan-API-compatible by design.
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
      base: process.env.BLOCKSCOUT_API_KEY || "",
      baseSepolia: process.env.BLOCKSCOUT_API_KEY || "",
      optimisticEthereum: process.env.BLOCKSCOUT_API_KEY || "",
      optimismSepolia: process.env.BLOCKSCOUT_API_KEY || "",
      arbitrumOne: process.env.BLOCKSCOUT_API_KEY || "",
      arbitrumSepolia: process.env.BLOCKSCOUT_API_KEY || "",
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
      // Blockscout instances for A3 L2 chains
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://base.blockscout.com/api",
          browserURL: "https://base.blockscout.com",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com",
        },
      },
      {
        network: "optimisticEthereum",
        chainId: 10,
        urls: {
          apiURL: "https://optimism.blockscout.com/api",
          browserURL: "https://optimism.blockscout.com",
        },
      },
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com",
        },
      },
      {
        network: "arbitrumOne",
        chainId: 42161,
        urls: {
          apiURL: "https://arbitrum.blockscout.com/api",
          browserURL: "https://arbitrum.blockscout.com",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://arbitrum-sepolia.blockscout.com/api",
          browserURL: "https://arbitrum-sepolia.blockscout.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
  mocha: { timeout: 1000000 },
};
