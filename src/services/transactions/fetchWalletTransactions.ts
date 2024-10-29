export const fetchWalletTransactions = async (address: string) => {
  const response = await fetch(`/api/transactions?address=${address}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const { data } = await response.json();
  return data;
};