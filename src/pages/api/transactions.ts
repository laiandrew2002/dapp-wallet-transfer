import { NextApiRequest, NextApiResponse } from 'next';
import { Alchemy, AssetTransfersCategory, AssetTransfersWithMetadataResult, Network } from 'alchemy-sdk';
import { handleErrorResponse, handleSuccessResponse } from '@/lib/utils/apiHandler';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

async function fetchTransactions(address: string) {
  try {
    const sentTransfers = await alchemy.core.getAssetTransfers({
      fromAddress: address,
      fromBlock: '0x0',
      category: [AssetTransfersCategory.EXTERNAL],
      withMetadata: true,
    });
    const receivedTransfers = await alchemy.core.getAssetTransfers({
      toAddress: address,
      fromBlock: '0x0',
      category: [AssetTransfersCategory.EXTERNAL],
      withMetadata: true,
    });
    const allTransfers = [...sentTransfers.transfers, ...receivedTransfers.transfers];
    return allTransfers.map(formatTransaction).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

const formatTransaction = (transaction: AssetTransfersWithMetadataResult) => {
  return {
    txHash: transaction.hash,
    from: transaction.from,
    to: transaction.to,
    amount: transaction.value,
    timestamp: new Date(transaction.metadata.blockTimestamp).toLocaleString(),
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return handleErrorResponse(res, 400, "Transaction ID is required and must be a string");
  }

  try {
    const transaction = await fetchTransactions(address);
    return handleSuccessResponse(res, 200, transaction);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return handleErrorResponse(res, 500, "Failed to fetch transaction");
  }
}