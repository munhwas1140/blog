'use client';

import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const DeleteButton = styled.button`
  color: #ef4444;

  &:hover {
    color: #b91c1c;
  }
`;

export const PostTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;
