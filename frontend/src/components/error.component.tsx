import React from 'react';

import { Box, Text } from '@chakra-ui/react';

export const ErrorComponent = ({ message }: any) => {
  return (
    <Box>
      <Text textStyle={'display1'}>{message}</Text>
      <Box
        title={message}
        as='iframe'
        src='https://giphy.com/embed/H54feNXf6i4eAQubud'
        width='100%'
        sx={{
          aspectRatio: '16/9',
        }}
      />
    </Box>
  );
};
