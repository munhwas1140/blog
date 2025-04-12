"use client";

import Link from "next/link";
import styled from "styled-components";

const HeaderContainer = styled.header`
  padding: 1.25rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f3f4f6;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const BlueLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #3b82f6;
  transform: rotate(45deg);
  transition: transform 0.3s ease;

  ${LogoLink}:hover & {
    transform: rotate(90deg);
  }
`;

const GreenLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #22c55e;
  border-radius: 9999px;
  margin-left: -0.5rem;
  transition: transform 0.3s ease;

  ${LogoLink}:hover & {
    transform: scale(1.1);
  }
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const WriteButton = styled(Link)`
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1f2937;
  }
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Container>
        <Flex>
          <LogoLink href="/">
            <LogoContainer>
              <BlueLogo />
              <GreenLogo />
            </LogoContainer>
            <LogoText>소리의 일기</LogoText>
          </LogoLink>
          <ButtonContainer>
            <WriteButton href="/write">글 쓰기</WriteButton>
          </ButtonContainer>
        </Flex>
      </Container>
    </HeaderContainer>
  );
}
