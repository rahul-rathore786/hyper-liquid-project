import { setGlobalState, getGlobalState } from "../store";
import DappWorksAbi from "../abis/contracts/DappWorks.sol/DappWorks.json";
import UsdtAbi from "../abis/contracts/USDT.sol/USDT.json";
import { ethers } from "ethers";
import { logOutWithCometChat } from "./chat";
import { NETWORKS } from "../utils/chain";

const { ethereum } = window;
import addresses from "../abis/contractAddress.json";

const DappWorksAddress = addresses.DappWorks;
const DappWorksABI = DappWorksAbi.abi;
const UsdtAddress = addresses.USDT;
const UsdtABI = UsdtAbi.abi;

// Default network for the application
const DEFAULT_NETWORK_KEY = "HYPERLIQUID_TESTNET";
const DEFAULT_NETWORK = NETWORKS[DEFAULT_NETWORK_KEY];

let tx;

const getUsdtBalance = async (account) => {
  // If Metamask not present or account is undefined/empty, safely return 0 to avoid ENS lookup errors
  if (!ethereum || !account || account.trim() === "") return "0";
  try {
    const contract = await getUsdtContract();
    const bal = await contract.balanceOf(account);
    return fromWei(bal);
  } catch (err) {
    reportError(err);
    return "0";
  }
};

const getNativeBalance = async (account) => {
  // If Metamask not present or account is undefined/empty, safely return 0
  if (!ethereum || !account || account.trim() === "") return "0";
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(account);
    return fromWei(balance);
  } catch (err) {
    reportError(err);
    return "0";
  }
};

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

const getProvider = () => {
  if (ethereum) {
    return new ethers.providers.Web3Provider(ethereum);
  } else {
    return new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
  }
};

const getSigner = async () => {
  const provider = getProvider();
  const accounts = await provider.listAccounts();
  return accounts.length > 0 ? provider.getSigner() : null;
};

const getDappWorksContract = async () => {
  const signer = await getSigner();
  const provider = getProvider();
  const signerOrProvider = signer || provider;

  if (!DappWorksAddress || !ethers.utils.isAddress(DappWorksAddress)) {
    throw new Error(
      "Invalid or missing DappWorks contract address. Please verify that `contractAddress.json` contains a valid `DappWorks` address."
    );
  }

  return new ethers.Contract(DappWorksAddress, DappWorksABI, signerOrProvider);
};

const isAdmin = async () => {
  try {
    const contract = await getDappWorksContract();
    const owner = await contract.owner();
    const connectedAccount = getGlobalState("connectedAccount");
    const isAdmin = owner.toLowerCase() === connectedAccount.toLowerCase();
    setGlobalState("isAdmin", isAdmin);
    return isAdmin;
  } catch (error) {
    reportError(error);
    return false;
  }
};

const getUsdtContract = async () => {
  const signer = await getSigner();
  const provider = getProvider();
  const signerOrProvider = signer || provider;

  if (!UsdtAddress || !ethers.utils.isAddress(UsdtAddress)) {
    throw new Error(
      "Invalid or missing USDT contract address. Please verify that `contractAddress.json` contains a valid `USDT` address."
    );
  }

  return new ethers.Contract(UsdtAddress, UsdtABI, signerOrProvider);
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      console.log("MetaMask not installed");
      setGlobalState("connectedAccount", "");
      return false;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });

    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", async () => {
      const acc = await ethereum.request({ method: "eth_accounts" });
      setGlobalState("connectedAccount", acc[0] || "");
      await loadData();
      await isWalletConnected();
      logOutWithCometChat();
    });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0]);
    } else {
      setGlobalState("connectedAccount", "");
      console.log("No accounts found");
    }
    await loadData();
    await isAdmin();
    return true;
  } catch (error) {
    reportError(error);
    return false;
  }
};

const connectWallet = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0]);
  } catch (error) {
    reportError(error);
  }
};

const addJobListing = async ({
  jobTitle,
  description,
  tags,
  minBudget,
  maxBudget,
}) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.addJobListing(
        jobTitle,
        description,
        tags,
        toWei(minBudget),
        toWei(maxBudget)
      );
      await tx.wait();
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const updateJob = async ({
  id,
  jobTitle,
  description,
  tags,
  minBudget,
  maxBudget,
}) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.updateJob(
        id,
        jobTitle,
        description,
        tags,
        toWei(minBudget),
        toWei(maxBudget)
      );
      await tx.wait();
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const deleteJob = async (id) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.deleteJob(id);
      await tx.wait();
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const bidForJob = async (id, amount) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.bidForJob(id, toWei(amount));
      await tx.wait();
      await getJob(id);
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const approveUSDT = async (amount) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getUsdtContract();
      tx = await contract.approve(DappWorksAddress, toWei(amount));
      await tx.wait();
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const approveSpend = async (amount) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getUsdtContract();
      const dappworks_contract = await getDappWorksContract();
      tx = await contract.approve(dappworks_contract.address, toWei(amount));
      await tx.wait();
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const acceptBid = async (id, bidder) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.acceptBid(id, bidder);
      await tx.wait();
      await getJob(id);
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const completeJob = async (id, githubUrl) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.completeJob(id, githubUrl);
      await tx.wait();
      await getJob(id);
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const payout = async (id) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.payout(id);
      await tx.wait();
      await getJob(id);
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const raiseDispute = async (id) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.raiseDispute(id);
      await tx.wait();
      await getJob(id);
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const resolveDispute = async (id, percentage) => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract();
      tx = await contract.resolveDispute(id, percentage);
      await tx.wait();
      await getJob(id);
      await loadData();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

const getBidders = async (id) => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const bidders = await contract.getBidders(id);
    setGlobalState("bidders", structuredBidder(bidders));
  } catch (err) {
    reportError(err);
  }
};

const getJobs = async () => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const jobs = await contract.getJobs();
    setGlobalState("jobs", structuredJobs(jobs));
  } catch (err) {
    reportError(err);
  }
};

const getMyJobs = async () => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const jobs = await contract.getMyJobs();
    setGlobalState("myjobs", structuredJobs(jobs));
  } catch (err) {
    reportError(err);
  }
};

const getMyGigs = async () => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const jobs = await contract.getAssignedJobs();
    setGlobalState("mygigs", structuredJobs(jobs));
  } catch (err) {
    reportError(err);
  }
};

const getMyBidJobs = async () => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const jobs = await contract.getJobsForBidder();
    setGlobalState("mybidjobs", structuredJobs(jobs));
  } catch (err) {
    reportError(err);
  }
};

const getDisputedJobs = async () => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const jobs = await contract.getDisputedJobs();
    setGlobalState("disputedJobs", structuredJobs(jobs));
  } catch (err) {
    reportError(err);
  }
};

const getJob = async (id) => {
  if (!ethereum) return alert("Please install Metamask");
  try {
    const contract = await getDappWorksContract();
    const job = await contract.getJob(id);
    setGlobalState("job", structuredJobs([job])[0]);
  } catch (err) {
    reportError(err);
  }
};

const loadData = async () => {
  if (!ethereum) return;

  try {
    await getJobs();
    await getMyJobs();
    await getMyGigs();
    await getMyBidJobs();
    if (getGlobalState("isAdmin")) {
      await getDisputedJobs();
    }
  } catch (error) {
    console.log("Error loading data:", error);
  }
};

const structuredJobs = (jobs) =>
  jobs
    .map((job) => ({
      id: job.id.toNumber(),
      owner: job.owner.toLowerCase(),
      freelancer: job.freelancer.toLowerCase(),
      jobTitle: job.jobTitle,
      description: job.description,
      tags: job.tags.split(","),
      minBudget: fromWei(job.minBudget),
      maxBudget: fromWei(job.maxBudget),
      finalBudget: fromWei(job.finalBudget),
      githubUrl: job.githubUrl,
      timestamp: new Date(job.timestamp.toNumber() * 1000).getTime(),
      state: Number(job.state),
      completionPct: Number(job.completionPct),
      bidders: job.bidders.map((address) => address.toLowerCase()),
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

const structuredBidder = (bidders) =>
  bidders.map((bidder) => ({
    id: bidder.id.toNumber(),
    jId: bidder.jId.toNumber(),
    account: bidder.account.toLowerCase(),
    bidAmount: fromWei(bidder.bidAmount),
  }));

const reportError = (error) => {
  console.log(error);
};

/**
 * Switch to a specific network
 * @param {string} networkKey - The network key from NETWORKS object
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
const switchToNetwork = async (networkKey = DEFAULT_NETWORK_KEY) => {
  if (!ethereum) return false;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORKS[networkKey].chainId }],
    });
    return true;
  } catch (switchError) {
    // 4902 = chain not added to MetaMask
    if (switchError.code === 4902) {
      return false;
    }
    console.error(
      `Error switching to ${NETWORKS[networkKey].chainName}:`,
      switchError
    );
    return false;
  }
};

/**
 * Add a network to MetaMask
 * @param {string} networkKey - The network key from NETWORKS object
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
const addNetwork = async (networkKey = DEFAULT_NETWORK_KEY) => {
  if (!ethereum) return false;

  const networkConfig = NETWORKS[networkKey];

  // Create a new object with only the keys MetaMask accepts.
  // This prevents errors from custom keys like 'chainIdDecimal'.
  const paramsToAdd = {
    chainId: networkConfig.chainId,
    chainName: networkConfig.chainName,
    nativeCurrency: networkConfig.nativeCurrency,
    rpcUrls: networkConfig.rpcUrls,
    blockExplorerUrls: networkConfig.blockExplorerUrls,
  };

  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [paramsToAdd], // Pass the cleaned object
    });
    return true;
  } catch (error) {
    console.error(`Failed to add ${networkConfig.chainName} network`, error);
    return false;
  }
};

// Call the USDT faucet to mint 1000 tokens
const callUsdtFaucet = async () => {
  if (!ethereum) return alert("Please install Metamask");
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getUsdtContract();
      tx = await contract.faucet();
      await tx.wait();
      resolve(tx);
    } catch (err) {
      reportError(err);
      reject(err);
    }
  });
};

export {
  connectWallet,
  isWalletConnected,
  addJobListing,
  updateJob,
  deleteJob,
  bidForJob,
  acceptBid,
  payout,
  getBidders,
  getJobs,
  getMyJobs,
  getJob,
  getMyBidJobs,
  getMyGigs,
  loadData,
  approveUSDT,
  completeJob,
  approveSpend,
  isAdmin,
  raiseDispute,
  resolveDispute,
  getDisputedJobs,
  getUsdtBalance,
  getNativeBalance,
  switchToNetwork,
  addNetwork,
  DEFAULT_NETWORK,
  callUsdtFaucet,
};
