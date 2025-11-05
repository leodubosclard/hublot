import { ChakraProvider } from '@chakra-ui/react'
import { Router } from './Router';
import theme from './theme';

export const  App = () => (
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
);
