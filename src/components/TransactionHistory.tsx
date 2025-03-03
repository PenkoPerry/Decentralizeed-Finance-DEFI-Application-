import React from 'react';
import { useTransactionHistory } from '../lib/hooks/useTransactionHistory';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, RotateCcw, ExternalLink } from 'lucide-react';
import { formatUSD, formatNumber } from '../lib/utils';

export function TransactionHistory() {
  const { data: transactions, isLoading } = useTransactionHistory();

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <p className="text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tx.type === 'supply' && (
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-green-400" />
                  </div>
                )}
                {tx.type === 'borrow' && (
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <ArrowDownRight className="w-5 h-5 text-red-400" />
                  </div>
                )}
                {tx.type === 'repay' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-blue-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium capitalize">{tx.type}</p>
                  <p className="text-sm text-gray-400">
                    {formatNumber(tx.amount)} {tx.token}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {tx.timestamp.toLocaleDateString()}
                </span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}