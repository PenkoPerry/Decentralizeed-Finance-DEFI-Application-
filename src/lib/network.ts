import { sepolia } from 'viem/chains';
import { toast } from 'react-hot-toast';

export const REQUIRED_CHAIN = sepolia;

export async function switchToRequiredNetwork() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${REQUIRED_CHAIN.id.toString(16)}` }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${REQUIRED_CHAIN.id.toString(16)}`,
              chainName: REQUIRED_CHAIN.name,
              nativeCurrency: REQUIRED_CHAIN.nativeCurrency,
              rpcUrls: [REQUIRED_CHAIN.rpcUrls.default.http[0]],
              blockExplorerUrls: [REQUIRED_CHAIN.blockExplorers?.default.url],
            },
          ],
        });
      } catch (addError: any) {
        throw new Error('Failed to add Sepolia network to MetaMask');
      }
    } else {
      throw error;
    }
  }
}