'use client';

import styled, { keyframes } from 'styled-components';

export const ArticleContainer = styled.article`
  max-width: 48rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 3rem;

  @media (max-width: 640px) {
    padding-bottom: 2rem;
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

export const SkeletonImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  z-index: 1;
`;
