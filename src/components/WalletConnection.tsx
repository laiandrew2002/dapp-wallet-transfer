import React, { useEffect } from "react";
import {
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useClipboard,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon, CopyIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Icon } from '@chakra-ui/react'
import { IoWalletOutline } from "react-icons/io5";
import { connectWalletToSepolia, getProvider, switchToSepolia } from "../utils/ethers";
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
      const addr = await connectWalletToSepolia();
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
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined" && window.ethereum.request) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          try {
            const provider = getProvider();
            const network = await provider!.getNetwork();
            if (network.chainId !== 11155111) {
              await switchToSepolia();
            }
            setAddress(accounts[0]);
          } catch (error) {
            console.error("Error connecting to Sepolia network:", error);
            toast({
              title: "Connection Failed",
              description: "Failed to connect to Sepolia network. Please try again.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }
    };

    checkWalletConnection();
  }, [setAddress, toast]);

  return (
    <div>
      {address ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon as={IoWalletOutline}/>{truncateAddress(address)}
          </Box>
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
