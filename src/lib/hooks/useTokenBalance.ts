import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { publicClient, TOKENS } from '../contracts';
import { erc20Abi } from '../abis/erc20';

export function useTokenBalance(tokenAddress: string, decimals: number = 18) {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ['tokenBalance', tokenAddress, address],
    queryFn: async () => {
      if (!address || !isConnected) return '0';

      try {
        if (tokenAddress === TOKENS.ETH) {
          const balance = await publicClient.getBalance({ address });
          return formatUnits(balance, decimals);
        }

        const balance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
        });

        return formatUnits(balance, decimals);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        throw error; // Let React Query handle the error
      }
    },
    enabled: !!address && !!tokenAddress && isConnected,
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}