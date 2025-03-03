import { createPublicClient, http, createWalletClient, custom, parseEther, formatEther, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { erc20Abi } from './abis/erc20';
import { lendingPoolAbi } from './abis/lendingPool';
import toast from 'react-hot-toast';

// Use public RPC endpoint for Sepolia
const RPC_URL = 'https://rpc.sepolia.org';

// Contract addresses on Sepolia testnet
export const LENDING_POOL_ADDRESS = '0x4bd5643ac6f66a5237E18bfA7d47cF22f1c9F210' as const;
export const TOKENS = {
  USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
  ETH: '0x0000000000000000000000000000000000000000'
} as const;

// Token metadata
export const TOKEN_METADATA = {
  USDC: {
    name: 'USD Coin',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  WETH: {
    name: 'Wrapped Ether',
    decimals: 18,
    icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  ETH: {
    name: 'Ethereum',
    decimals: 18,
    icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  }
} as const;

// Initialize Viem clients with better configuration
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL, {
    retryCount: 5,
    retryDelay: 1500,
    timeout: 30000,
    batch: {
      batchSize: 1000,
      wait: 100,
    },
  }),
  batch: {
    multicall: {
      batchSize: 1024,
      wait: 100,
    },
  },
  pollingInterval: 4000,
});

export const getWalletClient = async () => {
  if (!window.ethereum) throw new Error('No wallet found. Please install MetaMask.');
  
  try {
    // Request accounts and network switch if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== `0x${sepolia.id.toString(16)}`) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${sepolia.id.toString(16)}` }],
      });
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet.');
    }

    return createWalletClient({
      account: accounts[0] as `0x${string}`,
      chain: sepolia,
      transport: custom(window.ethereum),
    });
  } catch (error: any) {
    console.error('Wallet client error:', error);
    if (error.code === 4001) {
      throw new Error('Please connect your wallet to continue.');
    }
    if (error.code === 4902) {
      throw new Error('Please add the Sepolia network to your wallet.');
    }
    throw new Error(error.message || 'Failed to initialize wallet client');
  }
};

// Add retry mechanism for contract calls
const withRetry = async <T>(fn: () => Promise<T>, retries = 5, delay = 1500): Promise<T> => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (i === retries - 1) break;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(1.5, i)));
    }
  }
  throw lastError;
};

export const getReserveData = async (tokenAddress: string) => {
  try {
    const data = await withRetry(() => publicClient.readContract({
      address: LENDING_POOL_ADDRESS,
      abi: lendingPoolAbi,
      functionName: 'getReserveData',
      args: [tokenAddress as `0x${string}`],
    }));

    if (!data) throw new Error('No reserve data returned');

    return {
      liquidityRate: Number(formatUnits(data[3], 27)),
      variableBorrowRate: Number(formatUnits(data[4], 27)),
      aTokenAddress: data[7],
      lastUpdateTimestamp: Number(data[6])
    };
  } catch (error) {
    console.error('Error fetching reserve data:', error);
    throw new Error('Failed to fetch reserve data. Please try again later.');
  }
};

export const getTokenBalance = async (tokenAddress: string, userAddress: string, decimals: number = 18) => {
  try {
    if (!userAddress) return '0';

    if (tokenAddress === TOKENS.ETH) {
      const balance = await withRetry(() => publicClient.getBalance({ 
        address: userAddress as `0x${string}` 
      }));
      return formatUnits(balance, decimals);
    }

    const balance = await withRetry(() => publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`],
    }));
    
    return formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0'; // Return 0 on error for better UX
  }
};

export const getTokenAllowance = async (tokenAddress: string, userAddress: string) => {
  try {
    if (!userAddress) return '0';
    if (tokenAddress === TOKENS.ETH) return Number.MAX_SAFE_INTEGER.toString();

    const allowance = await withRetry(() => publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [userAddress as `0x${string}`, LENDING_POOL_ADDRESS],
    }));
    
    return formatEther(allowance);
  } catch (error) {
    console.error('Error fetching allowance:', error);
    return '0';
  }
};

export const approveToken = async (tokenAddress: string, amount: string, decimals: number = 18) => {
  try {
    const walletClient = await getWalletClient();
    const [address] = await walletClient.getAddresses();
    
    if (!address) throw new Error('No wallet address found');
    
    const parsedAmount = decimals === 18 ? parseEther(amount) : BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)));
    const hash = await walletClient.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'approve',
      args: [LENDING_POOL_ADDRESS, parsedAmount],
      account: address,
    });
    
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error: any) {
    console.error('Approval error:', error);
    throw new Error(error.message || 'Failed to approve token');
  }
};

export const supply = async (tokenAddress: string, amount: string, decimals: number = 18) => {
  try {
    const walletClient = await getWalletClient();
    const [address] = await walletClient.getAddresses();
    
    if (!address) throw new Error('No wallet address found');

    // Check user balance
    const balance = await getTokenBalance(tokenAddress, address, decimals);
    if (Number(balance) < Number(amount)) {
      throw new Error('Insufficient balance');
    }

    let hash;
    if (tokenAddress === TOKENS.ETH) {
      hash = await walletClient.writeContract({
        address: LENDING_POOL_ADDRESS,
        abi: lendingPoolAbi,
        functionName: 'supply',
        args: [TOKENS.ETH, parseEther(amount), address, 0],
        value: parseEther(amount),
        account: address,
      });
    } else {
      const allowance = await getTokenAllowance(tokenAddress, address);
      if (Number(allowance) < Number(amount)) {
        const approvalTx = await approveToken(tokenAddress, amount, decimals);
        await toast.promise(
          publicClient.waitForTransactionReceipt({ hash: approvalTx }),
          {
            loading: 'Approving token...',
            success: 'Token approved!',
            error: 'Failed to approve token',
          }
        );
      }
      
      const parsedAmount = decimals === 18 ? parseEther(amount) : BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)));
      hash = await walletClient.writeContract({
        address: LENDING_POOL_ADDRESS,
        abi: lendingPoolAbi,
        functionName: 'supply',
        args: [tokenAddress, parsedAmount, address, 0],
        account: address,
      });
    }
    
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error: any) {
    console.error('Supply error:', error);
    throw new Error(error.message || 'Failed to supply assets');
  }
};

export const borrow = async (tokenAddress: string, amount: string, decimals: number = 18) => {
  try {
    const walletClient = await getWalletClient();
    const [address] = await walletClient.getAddresses();
    
    if (!address) throw new Error('No wallet address found');

    // Get user account data to check borrowing capacity
    const accountData = await getUserAccountData(address);
    const borrowAmount = Number(amount);
    const availableBorrows = Number(accountData.availableBorrowsETH);

    if (borrowAmount > availableBorrows) {
      throw new Error(`Insufficient borrowing capacity. Maximum available: ${availableBorrows.toFixed(4)} ETH`);
    }

    const parsedAmount = decimals === 18 ? parseEther(amount) : BigInt(Math.floor(borrowAmount * Math.pow(10, decimals)));
    const hash = await walletClient.writeContract({
      address: LENDING_POOL_ADDRESS,
      abi: lendingPoolAbi,
      functionName: 'borrow',
      args: [tokenAddress, parsedAmount, 2, 0, address],
      account: address,
    });
    
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error: any) {
    console.error('Borrow error:', error);
    throw new Error(error.message || 'Failed to borrow assets');
  }
};

export const repay = async (tokenAddress: string, amount: string, decimals: number = 18) => {
  try {
    const walletClient = await getWalletClient();
    const [address] = await walletClient.getAddresses();
    
    if (!address) throw new Error('No wallet address found');

    // Check user balance
    const balance = await getTokenBalance(tokenAddress, address, decimals);
    if (Number(balance) < Number(amount)) {
      throw new Error('Insufficient balance for repayment');
    }

    let hash;
    if (tokenAddress === TOKENS.ETH) {
      hash = await walletClient.writeContract({
        address: LENDING_POOL_ADDRESS,
        abi: lendingPoolAbi,
        functionName: 'repay',
        args: [TOKENS.ETH, parseEther(amount), 2, address],
        value: parseEther(amount),
        account: address,
      });
    } else {
      const allowance = await getTokenAllowance(tokenAddress, address);
      if (Number(allowance) < Number(amount)) {
        const approvalTx = await approveToken(tokenAddress, amount, decimals);
        await toast.promise(
          publicClient.waitForTransactionReceipt({ hash: approvalTx }),
          {
            loading: 'Approving token...',
            success: 'Token approved!',
            error: 'Failed to approve token',
          }
        );
      }
      
      const parsedAmount = decimals === 18 ? parseEther(amount) : BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)));
      hash = await walletClient.writeContract({
        address: LENDING_POOL_ADDRESS,
        abi: lendingPoolAbi,
        functionName: 'repay',
        args: [tokenAddress, parsedAmount, 2, address],
        account: address,
      });
    }
    
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error: any) {
    console.error('Repay error:', error);
    throw new Error(error.message || 'Failed to repay assets');
  }
};

export const getUserAccountData = async (userAddress: string) => {
  try {
    if (!userAddress) throw new Error('No user address provided');

    const data = await withRetry(() => publicClient.readContract({
      address: LENDING_POOL_ADDRESS,
      abi: lendingPoolAbi,
      functionName: 'getUserAccountData',
      args: [userAddress as `0x${string}`],
    }));
    
    return {
      totalCollateralETH: formatEther(data[0]),
      totalDebtETH: formatEther(data[1]),
      availableBorrowsETH: formatEther(data[2]),
      currentLiquidationThreshold: Number(data[3]) / 10000,
      ltv: Number(data[4]) / 10000,
      healthFactor: formatEther(data[5]),
    };
  } catch (error: any) {
    console.error('Get account data error:', error);
    throw new Error('Failed to fetch account data');
  }
};