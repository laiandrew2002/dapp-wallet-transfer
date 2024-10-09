import { NextApiRequest, NextApiResponse } from 'next';
import { Alchemy, AssetTransfersCategory, AssetTransfersWithMetadataResult, Network } from 'alchemy-sdk';

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
  if (req.method === 'GET') {
    const allTransactions = await fetchTransactions(req.query.address as string);

    res.status(200).json(allTransactions);
  } else if (req.method === 'POST') {
    // not use
    // const { from, to, amount } = req.body;
    // const newTransaction = {
    //   id: transactions.length + 1,
    //   from,
    //   to,
    //   amount,
    //   timestamp: Date.now(),
    // };
    // transactions.push(newTransaction);
    res.status(201).json([]);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}