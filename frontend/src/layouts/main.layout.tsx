import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

import React from 'react';
import { Container, Stack } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const LayoutComponent: React.FunctionComponent<Props> = ({
  children,
}: Props) => {
  return (
    <Stack
      justify={'space-between'}
      direction={'column'}
      minHeight={'100vh'}
      minW={'none'}
      pt={'7.5rem'}
      m={0}
      spacing={0}
    >
      <HeaderComponent />
      <Container
        as='main'
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        bg={'white'}
        m={0}
        p={0}
        maxWidth={'100vw'}
        height={'full'}
        minW={'none'}
      >
        {children}
      </Container>

      <FooterComponent />
    </Stack>
  );
};

export default LayoutComponent;
