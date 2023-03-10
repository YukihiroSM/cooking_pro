import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { MainRouter } from './navigation';

import './App.css';



export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      cacheTime: Infinity,
    },
  },
});

const AppContainer = () => {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
          <MainRouter />
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default AppContainer;
