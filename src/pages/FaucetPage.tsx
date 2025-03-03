import React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { WalletConnect } from '../components/WalletConnect';
import { ExternalLink } from 'lucide-react';

const FAUCETS = [
  {
    symbol: 'ETH',
    name: 'Sepolia ETH',
    faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum',
    description: 'Get test ETH from Google Cloud Web3 Faucet',
    network: 'Sepolia Testnet',
    amount: '0.5 ETH'
  },
  {
    symbol: 'USDC',
    name: 'Sepolia USDC',
    faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum',
    description: 'Get test USDC from Google Cloud Web3 Faucet',
    network: 'Sepolia Testnet',
    amount: '1000 USDC'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped ETH',
    faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum',
    description: 'Get test WETH from Google Cloud Web3 Faucet',
    network: 'Sepolia Testnet',
    amount: '0.5 WETH'
  }
];

export function FaucetPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="pt-32 px-4 pb-12 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8">Connect your wallet to access the Sepolia testnet faucets</p>
          <WalletConnect />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Google Cloud Web3 Faucets</h2>
          <p className="text-gray-400 mb-8">Get Sepolia testnet tokens from Google Cloud's Web3 faucet to try out BorrowChain</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAUCETS.map((faucet, index) => (
              <motion.div
                key={faucet.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{faucet.name}</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {faucet.network}
                  </span>
                </div>
                <p className="text-gray-400 mb-2">{faucet.description}</p>
                <p className="text-green-400 mb-4">Amount: {faucet.amount}</p>
                <a
                  href={faucet.faucetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get {faucet.symbol}
                  <ExternalLink size={16} />
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">How to Get Testnet Tokens</h4>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Visit the Google Cloud Web3 Faucet using the links above</li>
              <li>Connect your wallet to the faucet website</li>
              <li>Select the token you want to receive</li>
              <li>Complete any verification if required</li>
              <li>Receive your testnet tokens</li>
            </ol>
            <p className="mt-4 text-gray-400">
              Note: These are Sepolia testnet tokens and have no real value. They are only for testing purposes.
              Make sure your wallet is connected to the Sepolia testnet before requesting tokens.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}