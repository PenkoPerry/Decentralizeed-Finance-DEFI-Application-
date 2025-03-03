import React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { WalletConnect } from '../components/WalletConnect';
import { AccountHealth } from '../components/AccountHealth';
import { TransactionHistory } from '../components/TransactionHistory';
import { MarketChart } from '../components/MarketChart';
import { getUserAccountData } from '../lib/contracts';
import { useQuery } from '@tanstack/react-query';
import { formatUSD } from '../lib/utils';

export function DashboardPage() {
  const { isConnected, address } = useAccount();

  const { data: accountData, isLoading } = useQuery({
    queryKey: ['accountData', address],
    queryFn: async () => {
      if (!address) return null;
      return getUserAccountData(address);
    },
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (!isConnected) {
    return (
      <div className="pt-32 px-4 pb-12 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8">Connect your wallet to view your dashboard</p>
          <WalletConnect />
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-gray-700 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-gray-700 rounded-xl" />
              <div className="h-32 bg-gray-700 rounded-xl" />
            </div>
            <div className="h-64 bg-gray-700 rounded-xl" />
          </div>
        </div>
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
          <h2 className="text-3xl font-bold mb-6">Your Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4">Supply Balance</h3>
              <p className="text-3xl font-bold text-blue-400">
                {accountData ? formatUSD(Number(accountData.totalCollateralETH)) : '$0.00'}
              </p>
              <p className="text-sm text-gray-400 mt-2">Across all markets</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-red-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4">Borrow Balance</h3>
              <p className="text-3xl font-bold text-red-400">
                {accountData ? formatUSD(Number(accountData.totalDebtETH)) : '$0.00'}
              </p>
              <p className="text-sm text-gray-400 mt-2">Across all markets</p>
            </motion.div>
          </div>

          {accountData && (
            <AccountHealth
              healthFactor={Number(accountData.healthFactor)}
              ltv={accountData.ltv}
              liquidationThreshold={accountData.currentLiquidationThreshold}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <MarketChart symbol="ETH" />
            <TransactionHistory />
          </div>
        </motion.div>
      </div>
    </div>
  );
}