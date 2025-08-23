import React from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaTelegram,
  FaLinkedin,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-1 md:col-span-1">
            <div className="font-display font-bold text-white text-2xl mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                SafeWorkPay
              </span>
            </div>
            <p className="text-sm mb-6">
              Secure blockchain-based platform for freelancers and clients.
              Connecting talent with opportunities through smart contracts.
            </p>
            <div className="flex space-x-4">
              <a
                // open link in the new tab
                target="_blank"
                rel="noopener noreferrer"
                href="https://x.com/Safe_Work_Pay"
                aria-label="Twitter"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                // open link in the new tab
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com"
                aria-label="GitHub"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FaGithub className="text-xl" />
              </a>
              {/* <a
                // open link in the new tab
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.com"
                aria-label="Discord"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FaDiscord className="text-xl" />
              </a> */}
              {/* <a
                // open link in the new tab
                target="_blank"
                rel="noopener noreferrer"
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </a> */}
              <a
                // open link in the new tab
                target="_blank"
                rel="noopener noreferrer"
                href="https://telegram.me/+Mho_IdyOVs01OWI1"
                aria-label="Telegram"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FaTelegram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="font-medium text-white text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-jobs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/post-job"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/myprojects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  My Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://multi-chain-coin-faucet.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mock USDT
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Faucet Link
                </a>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about-us"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              {/* <li>
                <a
                  href="https://forum.ceg.vote/t/safe-work-pay/5925"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                >
                  Metis Forum Page
                </a>
              </li>
              <li>
                <a
                  href="https://forum.ceg.vote/invites/RkLH1V87CG"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                >
                  Invite Link
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            {currentYear} SafeWorkPay. All rights reserved.
          </p>

          <div className="flex space-x-6 text-gray-400 text-sm">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies-policy"
              className="hover:text-white transition-colors"
            >
              Cookies Policy
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center">
            Built with <FaHeart className="text-red-500 mx-1" /> on the
            blockchain
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
