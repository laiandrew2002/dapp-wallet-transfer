import React, { FormEvent, useState } from "react";
import { sendTransaction } from "../lib/utils/ethers";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ethers } from "ethers";


interface TransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferSuccess: () => void;
  address: string | null;
  balance: string | null;
}

const TransferModal = ({ isOpen, onClose, onTransferSuccess, address, balance }: TransferFormProps) => {
  const toast = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    try {
      // Check if the recipient address is a valid Ethereum address
      if (!ethers.utils.isAddress(recipient)) {
        setError("Invalid Ethereum address.");
        return false;
      }

      const formattedAmount = parseFloat(amount).toFixed(18);
      // Convert amount to BigNumber in Wei
      const amountInWei = ethers.utils.parseEther(formattedAmount);

      // Check if the amount is greater than 0
      if (amountInWei.lte(ethers.BigNumber.from(0))) {
        setError("Amount must be greater than 0.");
        return false;
      }

      // Check if the balance is sufficient (balance is in Wei)
      const balanceInWei = ethers.utils.parseEther(balance!);
      if (amountInWei.gt(balanceInWei)) {
        setError("Insufficient balance.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Invalid input", error);
      setError("Invalid input. Please check the amount.");
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateInputs() || !recipient || !amount) {
      return;
    }

    try {
      setIsLoading(true);
      const tx = await sendTransaction(recipient, amount);
      await tx.wait();
      // Here you would typically call your API to record the transaction
      toast({
        title: "Transaction Sent",
        description: "Your transaction has been sent successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onTransferSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to send transaction:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!address) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer ETH</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel htmlFor="recipient">Recipient Address:</FormLabel>
                <Input
                  placeholder="0x..."
                  id="recipient"
                  data-testid="recipient"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel htmlFor="amount">Amount (ETH):</FormLabel>
                <Input
                  id="amount"
                  data-testid="amount"
                  placeholder="0.0"
                  type="number"
                  step="0.000000000000000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </FormControl>
              {error && (
                <Text color="red.500" fontSize="sm" textAlign="left" w="100%">
                  {error}
                </Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading} isDisabled={isLoading}>
              Send
            </Button>
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal;
