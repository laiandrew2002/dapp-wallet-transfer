import React, { useEffect } from "react";
import { connectWallet } from "../utils/ethers";

interface WalletConnectionProps {
  address: string | null;
  setAddress: (address: string | null) => void;
}

const WalletConnection = ({ address, setAddress }: WalletConnectionProps) => {
  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  const handleDisconnect = () => {
    setAddress(null);
  };
  useEffect(() => {
    const checkConnection = async () => {
        if (typeof window.ethereum !== "undefined" && window.ethereum.request) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    };
    checkConnection();
  }, [setAddress]);
  return (
    <div>
      {address ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnection;