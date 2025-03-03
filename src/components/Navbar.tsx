import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { motion } from 'framer-motion';
import { LayoutDashboard, Coins, Droplet } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Markets', path: '/markets', icon: Coins },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Faucet', path: '/faucet', icon: Droplet },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 backdrop-blur-md bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  BorrowChain
                </h1>
                <span className="text-sm text-blue-400 font-medium px-2 py-1 rounded-full bg-blue-400/10">
                  beta
                </span>
              </motion.div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map(({ name, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    location.pathname === path
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}