'use client';

import {
  HeaderContainer,
  Container,
  Flex,
  LogoLink,
  LogoContainer,
  BlueLogo,
  GreenLogo,
  LogoText,
  ButtonContainer,
  WriteButton,
  ThreeJsButton,
} from './Header.styles';

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
            <WriteButton href="/write">새로운 글 쓰기</WriteButton>
            <ThreeJsButton
              href="/three"
              aria-label="Three.js 데모"
              title="Three.js 데모"
            />
          </ButtonContainer>
        </Flex>
      </Container>
    </HeaderContainer>
  );
}
