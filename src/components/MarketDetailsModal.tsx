import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatNumber, formatUSD } from '../lib/utils';
import { SupplyModal } from './SupplyModal';
import { BorrowModal } from './BorrowModal';

interface MarketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: {
    symbol: string;
    name: string;
    totalSupply: number;
    supplyApy: number;
    totalBorrow: number;
    borrowApy: number;
    tokenIcon?: string;
    collateralFactor: number;
    reserveFactor: number;
    availableLiquidity: number;
    tokenAddress: string;
  };
}

export function MarketDetailsModal({ isOpen, onClose, market }: MarketDetailsModalProps) {
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
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
            className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-gray-700"
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
                  <h3 className="text-xl font-bold text-white">{market.name}</h3>
                  <p className="text-gray-400">{market.symbol}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Supply Information</h4>
                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Supply</span>
                      <span className="text-white font-medium">{formatUSD(market.totalSupply)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Supply APY</span>
                      <span className="text-green-400 font-medium">{formatNumber(market.supplyApy)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Market Details</h4>
                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Collateral Factor</span>
                      <span className="text-white font-medium">{formatNumber(market.collateralFactor * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reserve Factor</span>
                      <span className="text-white font-medium">{formatNumber(market.reserveFactor * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Borrow Information</h4>
                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Borrows</span>
                      <span className="text-white font-medium">{formatUSD(market.totalBorrow)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Borrow APY</span>
                      <span className="text-red-400 font-medium">{formatNumber(market.borrowApy)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available Liquidity</span>
                      <span className="text-white font-medium">{formatUSD(market.availableLiquidity)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowSupplyModal(true)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Supply
                  </button>
                  <button
                    onClick={() => setShowBorrowModal(true)}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Borrow
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <SupplyModal
        isOpen={showSupplyModal}
        onClose={() => setShowSupplyModal(false)}
        market={market}
      />

      <BorrowModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        market={market}
      />
    </>
  );
}