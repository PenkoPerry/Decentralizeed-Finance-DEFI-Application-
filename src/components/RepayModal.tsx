import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAccount } from 'wagmi';
import { formatNumber, formatUSD } from '../lib/utils';
import { repay, approveToken, getTokenAllowance } from '../lib/contracts';
import toast from 'react-hot-toast';

interface RepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: {
    symbol: string;
    name: string;
    tokenAddress: string;
    borrowApy: number;
    tokenIcon?: string;
    debtBalance: number;
  };
}

export function RepayModal({ isOpen, onClose, market }: RepayModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRepay = async () => {
    if (!address || !amount) return;
    
    try {
      setIsLoading(true);
      
      // Check allowance
      const allowance = await getTokenAllowance(market.tokenAddress, address);
      if (Number(allowance) < Number(amount)) {
        const approvalTx = await approveToken(market.tokenAddress, amount);
        await toast.promise(
          publicClient.waitForTransactionReceipt({ hash: approvalTx }),
          {
            loading: 'Approving token...',
            success: 'Token approved!',
            error: 'Failed to approve token',
          }
        );
      }
      
      // Repay
      const tx = await repay(market.tokenAddress, amount);
      await toast.promise(
        publicClient.waitForTransactionReceipt({ hash: tx }),
        {
          loading: 'Repaying debt...',
          success: 'Debt repaid successfully!',
          error: 'Failed to repay debt',
        }
      );
      
      onClose();
    } catch (error) {
      console.error('Repay error:', error);
      toast.error('Failed to repay debt');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {market.tokenIcon ? (
                <img src={market.tokenIcon} alt={market.symbol} className="w-12 h-12 rounded-xl" />
              ) : (
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-semibold">
                  {market.symbol.slice(0, 2)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">Repay {market.name}</h3>
                <p className="text-gray-400">Current Debt: {formatUSD(market.debtBalance)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
                Amount to Repay
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setAmount(market.debtBalance.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              onClick={handleRepay}
              disabled={isLoading || !amount}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Repaying...' : 'Repay'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}