'use client';

import styled from 'styled-components';

export const StyledScrollTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #3b82f6;
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 40;

  &:hover {
    background-color: #2563eb;
  }
`;
