import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import TransferModal from './TransferModal';

interface TransferButtonProps {
  address: string | null;
  balance: string | null;
  onTransferSuccess: () => void;
}

const TransferButton = ({ address, balance, onTransferSuccess }: TransferButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!address) return null;

  return (
    <>
      <Button colorScheme="blue" onClick={openModal}>Send ETH</Button>
      <TransferModal
        isOpen={isModalOpen}
        onClose={closeModal}
        address={address}
        balance={balance}
        onTransferSuccess={onTransferSuccess}
      />
    </>
  );
};

export default TransferButton;