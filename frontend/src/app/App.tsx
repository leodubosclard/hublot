import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react';
import { Router } from './Router';
import theme from './theme';

export const  App = () => (
    <ChakraProvider theme={theme}>
      <Analytics />
      <Router />
    </ChakraProvider>
);
