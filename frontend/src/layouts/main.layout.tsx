import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

import React from 'react';
import { Container } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const LayoutComponent: React.FunctionComponent<Props> = ({
  children,
}: Props) => {
  return (
    <>
      <HeaderComponent />
      <Container
        as='main'
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        bg={'light'}
        pt={'10rem'}
        pb={'1.5rem'}
        margin={'auto'}
        maxWidth={'100vw'}
      >
        {children}
      </Container>
      <FooterComponent />
    </>
  );
};

export default LayoutComponent;
