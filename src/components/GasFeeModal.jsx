import React, { useState } from "react";
import { FaTimes, FaCopy, FaGasPump } from "react-icons/fa";
import { DEFAULT_NETWORK } from "../services/blockchain";

const GasFeeModal = ({ visible, onClose, walletAddress }) => {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
              <FaGasPump className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white flex-grow">
              Insufficient Gas
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            You need{" "}
            <span className="font-semibold">
              {DEFAULT_NETWORK.nativeCurrency.symbol}
            </span>{" "}
            ({DEFAULT_NETWORK.chainName} tokens) to pay for gas fees. Visit the{" "}
            {DEFAULT_NETWORK.chainName} faucet to get free test tokens:
          </p>

          {/* Wallet address section */}
          <div className="mb-5 bg-gray-50 border border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Your wallet address:
            </p>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3">
              <div className="text-gray-800 text-sm truncate pr-2 font-mono">
                {walletAddress}
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-1 rounded-md flex items-center transition-colors"
                title="Copy to clipboard"
              >
                <FaCopy className="mr-1" />
                <span className="text-xs font-medium">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Action button */}
          <a
            href="https://hyperliquid-faucet.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center mb-4"
          >
            Get Free {DEFAULT_NETWORK.chainName} Tokens
          </a>

          <div className="text-sm text-gray-500 mt-4 bg-gray-50 p-3 rounded-md border-l-4 border-primary-400">
            <p>
              After receiving tokens, return to SafeWorkPay to continue using
              the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasFeeModal;
