import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

const LayoutComponent: React.FunctionComponent<Props> = ({
  children,
}: Props) => {
  return (
    <>
      <HeaderComponent />
      <div>{children}</div>
      <FooterComponent />
    </>
  );
};

export default LayoutComponent;
