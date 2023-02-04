import React from 'react';

import { Spinner } from '@chakra-ui/react';

export const Loader = () => (
  <Spinner
    position={'absolute'}
    left={0}
    right={0}
    top={0}
    bottom={0}
    m={'auto'}
    color='orange'
    size='xl'
  />
);
