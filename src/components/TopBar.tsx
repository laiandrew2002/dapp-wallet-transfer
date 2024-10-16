import React from 'react';
import {
  Box,
  Flex,
  Text,
  Image
} from '@chakra-ui/react';

const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bg="gray.100" px={4} py={2}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
            <Image src="/icon.png" alt="logo" width={10} height={10} mr={2}/>
            <Text
              fontSize="xl"
              fontWeight="bold"
              display={{ base: "none", sm: "block" }}
            >
              Wallet Transfer
            </Text>
        </Box>
        {children}
      </Flex>
    </Box>
  );
};

export default TopBar;