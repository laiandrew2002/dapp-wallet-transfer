import React, { FormEvent, useState } from "react";
import { sendTransaction } from "../utils/ethers";

interface TransferFormProps {
  address: string | null;
}

const TransferForm = ({ address }: TransferFormProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!address) {
      setStatus("Please connect your wallet first");
      return;
    }
    try {
      const tx = await sendTransaction(recipient, amount);
      setStatus(`Transaction sent: ${tx.hash}`);
      // Here you would typically call your API to record the transaction
    } catch (error) {
      console.error("Failed to send transaction:", error);
      setStatus("Transaction failed");
    }
  };

  if (!address) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Transfer ETH</h2>
      <div>
        <label htmlFor="recipient">Recipient Address:</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Amount (ETH):</label>
        <input
          id="amount"
          type="number"
          step="0.000000000000000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default TransferForm;