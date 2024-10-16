import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const connectWalletToSepolia = async () => {
  const provider = getProvider();
  if (!provider || !window.ethereum?.request) {
    throw new Error('No Ethereum wallet found');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Check if the wallet is already connected to Sepolia
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) {
      await switchToSepolia();
    }

    // Connect the wallet and return the address
    return await connectWallet();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const switchToSepolia = async () => {
  if (!window.ethereum?.request) {
    throw new Error('No Ethereum wallet found');
  }
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 4902) {
      await addSepoliaNetwork();
    } else {
      console.error('Error switching network:', error);
      throw error;
    }
  }
};

export const connectWallet = async () => {
  const provider = getProvider();
  if (!provider) {
    throw new Error('No Ethereum wallet found');
  }

  try {
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

const addSepoliaNetwork = async () => {
  if (!window.ethereum?.request) {
    throw new Error('No Ethereum wallet found');
  }
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xaa36a7',
          chainName: 'Sepolia Test Network',
          rpcUrls: ['https://rpc.sepolia.org'],
          nativeCurrency: {
            name: 'SepoliaETH',
            symbol: 'ETH',
            decimals: 18,
          },
          blockExplorerUrls: ['https://sepolia.etherscan.io/'],
        },
      ],
    });
  } catch (error) {
    console.error('Error adding Sepolia network:', error);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  const provider = getProvider();
  if (provider) {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
  throw new Error('No Ethereum wallet found');
};

export const sendTransaction = async (to: string, amount: string) => {
  const provider = getProvider();
  if (provider) {
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    });
    return tx;
  }
  throw new Error('No Ethereum wallet found');
};