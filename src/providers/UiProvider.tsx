import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

const UiProvider = ({children}: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}

export default UiProvider
