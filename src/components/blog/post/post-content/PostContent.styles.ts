'use client';

import styled, { keyframes } from 'styled-components';

export const ImageContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
  height: 28rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #f6f7f8;
  aspect-ratio: 16 / 9;

  /* 이미지 로드 전에 최소 높이와 너비를 지정하여 레이아웃 시프트 방지 */
  min-height: 28rem;
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
  font-size: 1.25rem;
  line-height: 1.8;
  width: 100%;
  color: #374151;

  @media (max-width: 1024px) {
    font-size: 1.2rem;
    line-height: 1.75;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.75;
  }

  @media (max-width: 640px) {
    font-size: 1rem;
    line-height: 1.7;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    color: #111827;
    line-height: 1.3;

    @media (max-width: 640px) {
      font-size: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
  }

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 2.25rem;
    margin-bottom: 1rem;
    color: #111827;
    line-height: 1.4;

    @media (max-width: 640px) {
      font-size: 1.5rem;
      margin-top: 1.75rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    color: #111827;
    line-height: 1.4;

    @media (max-width: 640px) {
      font-size: 1.25rem;
      margin-top: 1.5rem;
    }
  }

  p {
    margin-bottom: 1.5rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.75rem;
    margin-bottom: 1.5rem;
  }

  ol {
    list-style-type: decimal;
    padding-left: 1.75rem;
    margin-bottom: 1.5rem;
  }

  blockquote {
    padding: 1rem 1.5rem;
    border-left: 4px solid #3b82f6;
    background-color: #f9fafb;
    font-style: italic;
    margin: 2rem 0;
    border-radius: 0.25rem;
  }

  pre {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1.25rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
    font-size: 0.9em;
  }

  code {
    background-color: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
    font-size: 0.9em;
    color: #e11d48;
  }

  img {
    margin: 2rem auto;
    border-radius: 0.5rem;
    max-width: 100%;
    height: auto;
    display: block;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  a {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
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
