'use client';

import Header from './Header';
import {
  FlexContainer,
  Main,
  Footer,
  FooterContent,
} from './LayoutClient.styles';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  return (
    <FlexContainer>
      <Header />
      <Main>{children}</Main>
      <Footer>
        <FooterContent>Copyright © 2025 소리</FooterContent>
      </Footer>
    </FlexContainer>
  );
}
