import React from 'react';
import { Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { REQUIRED_CHAIN, switchToRequiredNetwork } from '../lib/network';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading: isConnecting } = useConnect({
    onSuccess: () => {
      toast.success('Wallet connected successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isLoading: isSwitching } = useSwitchChain();

  const handleConnect = async () => {
    try {
      // First try to switch to the required network
      await switchToRequiredNetwork();
      
      // Show connector selection if multiple connectors are available
      if (connectors.length > 1) {
        // Create a modal or dropdown for connector selection
        const connector = connectors[0]; // For now, use the first connector
        connect({ connector });
      } else if (connectors.length === 1) {
        connect({ connector: connectors[0] });
      } else {
        toast.error('No wallet connectors available');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Check if we're on the wrong network
  const isWrongNetwork = isConnected && chainId !== REQUIRED_CHAIN.id;

  if (isWrongNetwork) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => switchChain({ chainId: REQUIRED_CHAIN.id })}
        className="relative group flex items-center gap-2 bg-yellow-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition-colors border border-yellow-500"
        disabled={isSwitching}
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          {isSwitching ? 'Switching Network...' : 'Switch to Sepolia'}
        </span>
      </motion.button>
    );
  }

  if (isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => disconnect()}
        className="relative group flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700 hover:border-blue-500/50"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
        
        {/* Add glowing effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      disabled={isConnecting}
      className="relative group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg hover:shadow-blue-500/25"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      
      {/* Add animated glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-purple-400/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
    </motion.button>
  );
}