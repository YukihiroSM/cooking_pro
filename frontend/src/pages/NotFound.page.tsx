import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export const NotFoundPageComponent = () => {
  return (
    <Box>
      <Text textStyle={'display1'}>404 Not Found</Text>
      <Box
        title='404 not found'
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
