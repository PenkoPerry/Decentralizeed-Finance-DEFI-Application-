import { useQuery, useQueryClient } from '@tanstack/react-query';
import { publicClient, wsClient } from '../contracts';
import { formatEther } from 'viem';

const PRICE_FEEDS = {
  USDC: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
  WETH: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  WBTC: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c'
};

const REFRESH_INTERVAL = 30000; // 30 seconds

export function useMarketData(symbol: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['market', symbol],
    queryFn: async () => {
      const priceFeed = PRICE_FEEDS[symbol as keyof typeof PRICE_FEEDS];
      if (!priceFeed) throw new Error('Price feed not found');

      const latestRoundData = await publicClient.readContract({
        address: priceFeed,
        abi: [
          {
            inputs: [],
            name: 'latestRoundData',
            outputs: [
              { name: 'roundId', type: 'uint80' },
              { name: 'answer', type: 'int256' },
              { name: 'startedAt', type: 'uint256' },
              { name: 'updatedAt', type: 'uint256' },
              { name: 'answeredInRound', type: 'uint80' }
            ],
            stateMutability: 'view',
            type: 'function'
          }
        ],
        functionName: 'latestRoundData'
      });

      return {
        price: Number(formatEther(latestRoundData[1])),
        lastUpdate: new Date(Number(latestRoundData[3]) * 1000)
      };
    },
    refetchInterval: REFRESH_INTERVAL
  });
}