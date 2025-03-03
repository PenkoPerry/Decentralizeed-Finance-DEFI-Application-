import React from 'react';
import { Background3D } from '../components/Background3D';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Shield,
    title: 'Secure & Audited',
    description: 'Built on battle-tested smart contracts with regular security audits',
  },
  {
    icon: Zap,
    title: 'Instant Transactions',
    description: 'Fast and efficient lending and borrowing on Sepolia testnet',
  },
  {
    icon: LineChart,
    title: 'Real-time Markets',
    description: 'Live market data and dynamic interest rates for optimal returns',
  },
];

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Link your wallet to access the platform',
  },
  {
    number: '02',
    title: 'Supply Assets',
    description: 'Deposit your crypto assets to earn interest',
  },
  {
    number: '03',
    title: 'Borrow Funds',
    description: 'Use your supplied assets as collateral to borrow',
  },
  {
    number: '04',
    title: 'Earn & Repay',
    description: 'Earn interest on deposits while managing loans',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export function HomePage() {
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [stepsRef, stepsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="relative min-h-screen">
      <Background3D />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto relative z-10"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent"
            >
              Decentralized lending and borrowing made simple
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8"
            >
              Experience the future of DeFi with secure, transparent, and efficient financial services on the Sepolia testnet
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center justify-center gap-4"
            >
              <Link
                to="/markets"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/faucet"
                className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500/50"
              >
                Get Test Tokens
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-20 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                custom={index}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="group p-8 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 transform perspective-1000"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="relative py-20 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">Follow these simple steps to get started with BorrowChain</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate={stepsInView ? "visible" : "hidden"}
                custom={index}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 15,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                className="relative p-8 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group transform perspective-1000"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: 360 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 mt-4 text-white group-hover:text-blue-400 transition-colors">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}