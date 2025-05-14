import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { toast } from 'sonner';

export type NetworkType = 'mainnet' | 'devnet' | 'testnet' | 'localhost' | 'custom';

interface NetworkContextType {
  network: NetworkType;
  endpoint: string;
  setNetwork: (network: NetworkType) => void;
  customRpcUrl: string;
  setCustomRpcUrl: (url: string) => void;
}

const MAINNET_RPC_URL = import.meta.env.VITE_MAINNET_RPC_URL;
if (!MAINNET_RPC_URL) {
  toast.message("Mainnet Custom RPC url not found and the mainnet-beta might fail, so try using your own custom rpc url form any provider");
}

// Default fallback RPC URLs
const DEFAULT_RPC_URLS = {
  mainnet: MAINNET_RPC_URL || clusterApiUrl("mainnet-beta"),
  devnet: clusterApiUrl('devnet'),
  testnet: clusterApiUrl('testnet'),
  localhost: 'http://localhost:8899',
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage if available
  const savedNetwork = localStorage.getItem('solana-network') as NetworkType || 'devnet';
  const savedCustomRpc = localStorage.getItem('solana-custom-rpc') || '';

  const [network, setNetworkState] = useState<NetworkType>(savedNetwork);
  const [customRpcUrl, setCustomRpcUrlState] = useState<string>(savedCustomRpc);

  // Get the RPC endpoint based on the selected network
  const getEndpoint = (networkType: NetworkType): string => {
    switch (networkType) {
      case 'mainnet':
        return DEFAULT_RPC_URLS.mainnet;
      case 'devnet':
        return DEFAULT_RPC_URLS.devnet;
      case 'testnet':
        return DEFAULT_RPC_URLS.testnet;
      case 'localhost':
        return DEFAULT_RPC_URLS.localhost;
      case 'custom':
        return customRpcUrl || DEFAULT_RPC_URLS.devnet;
      default:
        return DEFAULT_RPC_URLS.devnet;
    }
  };

  const setNetwork = (newNetwork: NetworkType) => {
    setNetworkState(newNetwork);
    localStorage.setItem('solana-network', newNetwork);
  };

  const setCustomRpcUrl = (url: string) => {
    setCustomRpcUrlState(url);
    localStorage.setItem('solana-custom-rpc', url);

    // If setting a custom URL, also switch to custom network type
    if (url && network !== 'custom') {
      setNetwork('custom');
    }
  };

  // Update localStorage when network or customRpcUrl changes
  useEffect(() => {
    localStorage.setItem('solana-network', network);
    localStorage.setItem('solana-custom-rpc', customRpcUrl);
  }, [network, customRpcUrl]);

  const value = {
    network,
    endpoint: getEndpoint(network),
    setNetwork,
    customRpcUrl,
    setCustomRpcUrl,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
