import React, { useState, useEffect } from "react";

interface Transaction {
  id: number;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

interface TransactionHistoryProps {
  address: string | null;
}

const TransactionHistory = ({ address }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  if (!address) return null;

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            From: {tx.from}, To: {tx.to}, Amount: {tx.amount} ETH, Time:{" "}
            {new Date(tx.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;