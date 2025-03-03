import React from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../lib/hooks/useMarketData';
import { formatUSD } from '../lib/utils';

interface MarketChartProps {
  symbol: string;
}

export function MarketChart({ symbol }: MarketChartProps) {
  const { data: marketData, isLoading } = useMarketData(symbol);

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700/50 rounded w-1/4" />
          <div className="h-40 bg-gray-700/50 rounded" />
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  return (
    <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{symbol} Price</h3>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatUSD(marketData.price)}</p>
          <p className="text-sm text-gray-400">
            Last updated: {marketData.lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      <div className="h-40 relative">
        {/* Placeholder for chart - would use a charting library in production */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20" />
      </div>
    </div>
  );
}