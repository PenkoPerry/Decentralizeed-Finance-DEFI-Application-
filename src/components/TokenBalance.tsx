import React from 'react';
import { useTokenBalance } from '../lib/hooks/useTokenBalance';
import { formatNumber } from '../lib/utils';
import { motion } from 'framer-motion';

interface TokenBalanceProps {
  tokenAddress: string;
  symbol: string;
  decimals?: number;
}

export function TokenBalance({ tokenAddress, symbol, decimals = 18 }: TokenBalanceProps) {
  const { data: balance, isLoading, error } = useTokenBalance(tokenAddress, decimals);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-20 bg-gray-700 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-400">
        Error loading balance. Please try again.
      </div>
    );
  }

  const formattedBalance = formatNumber(Number(balance), decimals === 18 ? 4 : 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-gray-400"
    >
      Balance: {formattedBalance} {symbol}
    </motion.div>
  );
}