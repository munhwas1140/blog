'use client';

import styled, { keyframes } from 'styled-components';

export const ImageContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
  height: 24rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #f6f7f8;
  aspect-ratio: 16 / 9;

  /* 이미지 로드 전에 최소 높이와 너비를 지정하여 레이아웃 시프트 방지 */
  min-height: 24rem;
  min-width: 100%;

  /* 초기 로딩 시 화면에 표시되는 스켈레톤 배경 */
  &::before {
    content: '';
    display: block;
    width: 100%;
    padding-top: 56.25%; /* 16:9 비율 유지 */
    position: absolute;
    top: 0;
  }
`;

export const ContentContainer = styled.div`
  margin-bottom: 2.5rem;
  font-size: 1.125rem;
  line-height: 1.75;
  width: 100%;

  @media (max-width: 640px) {
    font-size: 1rem;
    line-height: 1.7;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 4px solid #e5e7eb;
    font-style: italic;
    margin: 1.5rem 0;
  }

  pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.375rem;
    margin: 1rem 0;
    overflow-x: auto;
  }

  code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }

  img {
    margin: 1rem auto;
    border-radius: 0.5rem;
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
