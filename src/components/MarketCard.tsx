import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { formatNumber, formatUSD, cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MarketCardProps {
  symbol: string;
  name: string;
  totalSupply: number;
  supplyApy: number;
  totalBorrow: number;
  borrowApy: number;
  onClick: () => void;
  tokenIcon?: string;
}

export function MarketCard({
  symbol,
  name,
  totalSupply,
  supplyApy,
  totalBorrow,
  borrowApy,
  onClick,
  tokenIcon,
}: MarketCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: -10 }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        rotateX: 5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-700 hover:border-blue-500/50 group transform perspective-1000"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {tokenIcon ? (
            <motion.img 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              src={tokenIcon} 
              alt={symbol} 
              className="w-14 h-14 rounded-xl shadow-lg" 
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-blue-400 font-semibold shadow-lg">
              {symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{name}</h3>
            <p className="text-gray-400">{symbol}</p>
          </div>
        </div>
        <motion.div
          whileHover={{ rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight className="text-gray-400 group-hover:text-blue-400 transition-colors w-6 h-6" />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Total Supply</p>
          <motion.p 
            className="font-medium text-white text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 }}
          >
            {formatUSD(totalSupply)}
          </motion.p>
          <motion.p 
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              supplyApy > 0 ? "text-green-400" : "text-red-400"
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.3 }}
          >
            {formatNumber(supplyApy)}% APY
          </motion.p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Total Borrow</p>
          <motion.p 
            className="font-medium text-white text-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.2 }}
          >
            {formatUSD(totalBorrow)}
          </motion.p>
          <motion.p 
            className="text-sm font-medium text-red-400"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.3 }}
          >
            {formatNumber(borrowApy)}% APY
          </motion.p>
        </div>
      </div>

      {/* Add glowing effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}