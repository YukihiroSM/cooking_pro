import React from 'react';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { MainRouter } from './navigation';
import LayoutComponent from './layouts/main.layout';

const queryClient = new QueryClient({
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
        <LayoutComponent>
          <MainRouter />
        </LayoutComponent>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default AppContainer;