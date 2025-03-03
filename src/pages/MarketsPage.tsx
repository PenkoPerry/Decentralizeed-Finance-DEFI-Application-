import React, { useState } from 'react';
import { MarketCard } from '../components/MarketCard';
import { MarketDetailsModal } from '../components/MarketDetailsModal';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { TOKENS, TOKEN_METADATA } from '../lib/contracts';

const MARKETS = [
  {
    symbol: 'ETH',
    name: 'Sepolia ETH',
    totalSupply: 1234567890,
    supplyApy: 3.45,
    totalBorrow: 987654321,
    borrowApy: 4.56,
    tokenIcon: TOKEN_METADATA.ETH.icon,
    collateralFactor: 0.825,
    reserveFactor: 0.15,
    availableLiquidity: 246913578,
    tokenAddress: TOKENS.ETH
  },
  {
    symbol: 'USDC',
    name: 'Sepolia USDC',
    totalSupply: 2345678901,
    supplyApy: 2.34,
    totalBorrow: 876543210,
    borrowApy: 3.45,
    tokenIcon: TOKEN_METADATA.USDC.icon,
    collateralFactor: 0.75,
    reserveFactor: 0.20,
    availableLiquidity: 1469135782,
    tokenAddress: TOKENS.USDC
  },
  {
    symbol: 'WETH',
    name: 'Wrapped ETH',
    totalSupply: 3456789012,
    supplyApy: 1.23,
    totalBorrow: 765432109,
    borrowApy: 2.34,
    tokenIcon: TOKEN_METADATA.WETH.icon,
    collateralFactor: 0.70,
    reserveFactor: 0.25,
    availableLiquidity: 987654321,
    tokenAddress: TOKENS.WETH
  }
];

export function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<typeof MARKETS[0] | null>(null);

  const filteredMarkets = MARKETS.filter(market => 
    market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Sepolia Testnet Markets</h2>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market, index) => (
            <motion.div
              key={market.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MarketCard
                {...market}
                onClick={() => setSelectedMarket(market)}
              />
            </motion.div>
          ))}
        </div>

        {selectedMarket && (
          <MarketDetailsModal
            isOpen={!!selectedMarket}
            onClose={() => setSelectedMarket(null)}
            market={selectedMarket}
          />
        )}
      </div>
    </div>
  );
}