'use client';

import styled from 'styled-components';

export const ImageContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
  height: 24rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #f6f7f8;
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
