import { NextApiRequest, NextApiResponse } from 'next';

const transactions = [
  { id: 1, from: '0x123...', to: '0x456...', amount: '0.1', timestamp: Date.now() },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    const { from, to, amount } = req.body;
    const newTransaction = {
      id: transactions.length + 1,
      from,
      to,
      amount,
      timestamp: Date.now(),
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}