import truncateAddress from "@/utils/truncateAddress";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Table,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
  Box,
  useClipboard,
  IconButton,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

interface Transaction {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

interface TransactionHistoryProps {
  address: string | null;
}

const AddressCopy = ({ address }: { address: string }) => {
  const { onCopy } = useClipboard(address);
  const toast = useToast();

  const handleCopyAddress = () => {
    onCopy();
    toast({
      title: "Address Copied",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box display="flex" alignItems="center">
      <Text mr={2}>{truncateAddress(address)}</Text>
      <IconButton
        size="sm"
        aria-label="Copy address"
        icon={<CopyIcon />}
        onClick={() => handleCopyAddress()}
      />
    </Box>
  );
};

const TransactionHistory = ({ address }: TransactionHistoryProps) => {
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/transactions?address=${address}`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast({
          title: "Fetch Transactions Failed",
          description: "Failed to fetch transactions. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (address) fetchTransactions();
  }, [toast, address]);

  if (!address) return null;

  return (
    <Card mx="auto" mt={6} shadow="md" bg="gray.50">
      <CardHeader>
        <Heading as="h2" size="md">
          Transaction History
        </Heading>
      </CardHeader>
      <CardBody>
        {isLoading ? <CircularProgress isIndeterminate /> : !transactions.length ? (
          <Text>No transactions found.</Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th>Tx Hash</Th>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Amount (ETH)</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((tx) => (
                  <Tr key={tx.txHash}>
                    <Td><AddressCopy address={tx.txHash} /></Td>
                    <Td><AddressCopy address={tx.from} /></Td>
                    <Td><AddressCopy address={tx.to} /></Td>
                    <Td>{tx.amount}</Td>
                    <Td>{new Date(tx.timestamp).toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default TransactionHistory;
