import React, { useState, useEffect } from "react";
import { getBalance } from "../utils/ethers";

interface BalanceDisplayProps {
  address: string | null;
}

const BalanceDisplay = ({ address }: BalanceDisplayProps) => {
  const [balance, setBalance] = useState<string | null>(null);
  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const bal = await getBalance(address);
          setBalance(bal);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    };
    fetchBalance();
  }, [address]);
  if (!address) return null;
  return (
    <div>
      <h2>Balance</h2>
      {balance ? <p>{balance} ETH</p> : <p>Loading balance...</p>}
    </div>
  );
};

export default BalanceDisplay;
