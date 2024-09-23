import { ethers } from 'ethers';
export const getProvider = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const connectWallet = async () => {
  const provider = getProvider();
  if (provider) {
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    return await signer.getAddress();
  }
  throw new Error('No Ethereum wallet found');
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