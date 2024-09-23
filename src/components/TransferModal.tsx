import React, { FormEvent, useState } from "react";
import { sendTransaction } from "../utils/ethers";
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
  VStack,
} from "@chakra-ui/react";


interface TransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
}

const TransferModal = ({ isOpen, onClose, address }: TransferFormProps) => {
  const toast = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!address) {
      return;
    }
    try {
      const tx = await sendTransaction(recipient, amount);
      console.log(tx);
      // Here you would typically call your API to record the transaction
      toast({
        title: "Transaction Sent",
        description: "Your transaction has been sent successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
    }
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
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
              <FormControl isRequired>
                <FormLabel htmlFor="recipient">Recipient Address:</FormLabel>
                <Input
                  placeholder="0x..."
                  id="recipient"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="amount">Amount (ETH):</FormLabel>
                <Input
                  id="amount"
                  placeholder="0.0"
                  type="number"
                  step="0.000000000000000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
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
