"use client";

import styled from "styled-components";
import Header from "./Header";

interface LayoutClientProps {
  children: React.ReactNode;
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const Main = styled.main`
  max-width: 1280px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-grow: 1;
  padding-bottom: 2rem;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const Footer = styled.footer`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  background-color: #f3f4f6;
  margin-top: auto;
  width: 100%;
  border-top: 1px solid #e5e7eb;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

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
