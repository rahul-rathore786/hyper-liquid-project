/**
 * Network configuration utility for managing blockchain networks
 */

// Network configurations
export const NETWORKS = {
  // Ethereum Mainnet
  ETHEREUM: {
    chainId: "0x1",
    chainIdDecimal: 1,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io"],
  },

  // Sepolia Testnet
  SEPOLIA: {
    chainId: "0xaa36a7",
    chainIdDecimal: 11155111,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },

  // Hyperion Testnet
  HYPERION: {
    chainId: "0x20A55",
    chainIdDecimal: 133717,
    chainName: "Hyperion (Testnet)",
    nativeCurrency: {
      name: "Hyperion Metis",
      symbol: "hMETIS",
      decimals: 18,
    },
    rpcUrls: ["https://hyperion-testnet.metisdevops.link"],
    blockExplorerUrls: ["https://hyperion-testnet-explorer.metisdevops.link"],
  },

  // Hedera Testnet
  HEDERA: {
    chainId: "0x128",
    chainIdDecimal: 296,
    chainName: "Hedera Testnet",
    nativeCurrency: {
      name: "HBAR",
      symbol: "HBAR",
      decimals: 18,
    },
    rpcUrls: ["https://testnet.hashio.io/api"],
    blockExplorerUrls: ["https://hashscan.io/testnet"],
  },
  // add morph holesky
  MORPH_HOLESKY: {
    chainId: "0xAFA",
    chainIdDecimal: 2810,
    chainName: "Morph Holesky Testnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-quicknode-holesky.morphl2.io"],
    blockExplorerUrls: ["https://explorer-holesky.morphl2.io/"],
  },
  // add core testnet2
  CORE_TESTNET2: {
    chainId: "0x45A",
    chainIdDecimal: 1114,
    chainName: "Core Testnet2",
    nativeCurrency: {
      name: "tCore2",
      symbol: "tCORE2",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.test2.btcs.network"],
    blockExplorerUrls: ["https://scan.test2.btcs.network"],
  },
  // add hyperliquid testnet
  HYPERLIQUID_TESTNET: {
    chainId: "0x3E6",
    chainIdDecimal: 998,
    chainName: "Hyperliquid Testnet",
    nativeCurrency: {
      name: "Hyperliquid",
      symbol: "HYPE",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.hyperliquid-testnet.xyz/evm"],
    blockExplorerUrls: ["https://app.hyperliquid-testnet.xyz/explorer"],
  },
};

/**
 * Switch to a specific network
 * @param {Object} networkConfig - The network configuration object
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const switchToNetwork = async (networkConfig) => {
  const { ethereum } = window;
  if (!ethereum) return false;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkConfig.chainId }],
    });
    return true;
  } catch (switchError) {
    // 4902 = chain not added to MetaMask
    if (switchError.code === 4902) {
      return false;
    }
    console.error("Error switching network:", switchError);
    return false;
  }
};

/**
 * Add a network to MetaMask
 * @param {Object} networkConfig - The network configuration object
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const addNetwork = async (networkConfig) => {
  const { ethereum } = window;
  if (!ethereum) return false;

  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkConfig],
    });
    return true;
  } catch (error) {
    console.error(`Failed to add ${networkConfig.chainName} network`, error);
    return false;
  }
};

/**
 * Get the current network ID
 * @returns {Promise<string|null>} - The current network ID or null if not available
 */
export const getCurrentNetworkId = async () => {
  const { ethereum } = window;
  if (!ethereum) return null;

  try {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    return chainId;
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
};

/**
 * Check if the current network matches the given network
 * @param {string} networkChainId - The chain ID to check against
 * @returns {Promise<boolean>} - True if current network matches, false otherwise
 */
export const isCorrectNetwork = async (networkChainId) => {
  const currentChainId = await getCurrentNetworkId();
  return currentChainId === networkChainId;
};

/**
 * Get network name from chain ID
 * @param {string} chainId - The chain ID in hex format
 * @returns {string} - The network name or "Unknown Network"
 */
export const getNetworkName = (chainId) => {
  for (const [key, network] of Object.entries(NETWORKS)) {
    if (network.chainId === chainId) {
      return network.chainName;
    }
  }
  return "Unknown Network";
};
