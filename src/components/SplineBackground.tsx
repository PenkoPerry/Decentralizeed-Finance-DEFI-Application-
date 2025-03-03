import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export function SplineBackground() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSplineLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleSplineError = () => {
    setError('Failed to load 3D background');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 -z-10 bg-gray-900">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      <Spline 
        className="w-full h-full"
        scene="https://prod.spline.design/CYe03M82kPSu8a1o/scene.splinecode"
        onLoad={handleSplineLoad}
        onError={handleSplineError}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-900/80" />
    </div>
  );
}