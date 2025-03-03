import { useQuery } from '@tanstack/react-query';
import { publicClient } from '../contracts';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

export interface Transaction {
  hash: string;
  type: 'supply' | 'borrow' | 'repay';
  amount: number;
  token: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

export function useTransactionHistory() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['transactions', address],
    queryFn: async () => {
      if (!address) return [];

      const events = await publicClient.getLogs({
        address: LENDING_POOL_ADDRESS,
        event: [
          {
            anonymous: false,
            inputs: [
              { indexed: true, name: 'user', type: 'address' },
              { indexed: true, name: 'asset', type: 'address' },
              { indexed: false, name: 'amount', type: 'uint256' },
              { indexed: false, name: 'timestamp', type: 'uint256' }
            ],
            name: 'Supply',
            type: 'event'
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, name: 'user', type: 'address' },
              { indexed: true, name: 'asset', type: 'address' },
              { indexed: false, name: 'amount', type: 'uint256' },
              { indexed: false, name: 'timestamp', type: 'uint256' }
            ],
            name: 'Borrow',
            type: 'event'
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, name: 'user', type: 'address' },
              { indexed: true, name: 'asset', type: 'address' },
              { indexed: false, name: 'amount', type: 'uint256' },
              { indexed: false, name: 'timestamp', type: 'uint256' }
            ],
            name: 'Repay',
            type: 'event'
          }
        ],
        fromBlock: 'earliest',
        toBlock: 'latest'
      });

      return events.map(event => ({
        hash: event.transactionHash,
        type: event.eventName.toLowerCase() as Transaction['type'],
        amount: Number(formatEther(event.args.amount)),
        token: event.args.asset,
        timestamp: new Date(Number(event.args.timestamp) * 1000),
        status: 'success'
      }));
    },
    enabled: !!address
  });
}