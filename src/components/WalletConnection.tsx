import React, { useEffect } from "react";
import { Button, useToast, Menu, MenuButton, MenuList, MenuItem, useClipboard } from "@chakra-ui/react";
import { ChevronDownIcon, CopyIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { connectWallet } from "../utils/ethers";
import truncateAddress from "../utils/truncateAddress";

interface WalletConnectionProps {
  address: string | null;
  setAddress: (address: string | null) => void;
}

const WalletConnection = ({ address, setAddress }: WalletConnectionProps) => {
  const toast = useToast();
  const { onCopy } = useClipboard(address || "");
  
  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Your MetaMask wallet has been connected successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyAddress = () => {
    onCopy();
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined" && window.ethereum.request) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    };
    checkConnection();
  }, [setAddress]);

  return (
    <div>
      {address ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {truncateAddress(address)}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleCopyAddress} icon={<CopyIcon />}>Copy Address</MenuItem>
            <MenuItem onClick={handleDisconnect} icon={<SmallCloseIcon />}>Disconnect</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button colorScheme="blue" onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnection;
