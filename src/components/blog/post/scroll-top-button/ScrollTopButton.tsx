'use client';

import { ChevronUpIcon } from '@/components';
import { StyledScrollTopButton } from './ScrollTopButton.styles';

function ScrollTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <StyledScrollTopButton onClick={scrollToTop} aria-label="맨 위로 스크롤">
      <ChevronUpIcon color="white" />
    </StyledScrollTopButton>
  );
}

export default ScrollTopButton;
