import { NextApiRequest, NextApiResponse } from 'next';

const transactions = [
  { id: 1, from: '0x1c802a166f23d37f4c321f1c08c650cb6a898dcf', to: '0x7c116883478cfa36f91b4c314dabe90f8405282a', amount: '0.1', timestamp: Date.now() },
  { id: 2, from: '0x1c802a166f23d37f4c321f1c08c650cb6a898dcf', to: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', amount: '0.12', timestamp: Date.now() },
  { id: 3, from: '0x1c802a166f23d37f4c321f1c08c650cb6a898dcf', to: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', amount: '0.11', timestamp: Date.now() },
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