import { ChakraProvider } from '@chakra-ui/react'
import { Router } from './Router';

export const  App = () => (
    <ChakraProvider>
      <Router />
    </ChakraProvider>
);
