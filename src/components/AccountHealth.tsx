import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../lib/utils';

interface AccountHealthProps {
  healthFactor: number;
  ltv: number;
  liquidationThreshold: number;
}

export function AccountHealth({ healthFactor, ltv, liquidationThreshold }: AccountHealthProps) {
  const getHealthColor = () => {
    if (healthFactor >= 2) return 'text-green-400';
    if (healthFactor >= 1.1) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Account Health
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Health Factor</span>
            <span className={`font-medium ${getHealthColor()}`}>
              {formatNumber(healthFactor)}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((healthFactor / 3) * 100, 100)}%` }}
              className={`h-full ${getHealthColor()}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Current LTV</span>
            <p className="text-white font-medium">{formatNumber(ltv * 100)}%</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Liquidation Threshold</span>
            <p className="text-white font-medium">{formatNumber(liquidationThreshold * 100)}%</p>
          </div>
        </div>

        {healthFactor < 1.1 && (
          <div className="flex items-center gap-2 text-red-400 text-sm mt-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Your position is at risk of liquidation</span>
          </div>
        )}
      </div>
    </div>
  );
}