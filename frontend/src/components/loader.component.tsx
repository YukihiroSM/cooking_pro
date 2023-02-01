import React from 'react';

import { Flex, Spinner } from '@chakra-ui/react';

export const Loader = () => {
  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      w={'calc(100vw)'}
      h={'calc(100vh)'}
      pos={'fixed'}
      top={0}
    >
      <Spinner color='attention.dark' size='xl' />
    </Flex>
  );
};
