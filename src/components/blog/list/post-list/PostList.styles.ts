import styled, { css } from 'styled-components';
import Link from 'next/link';

export const Container = styled.div`
  transition: opacity 0.3s ease;
  width: 100%;
`;

export const PostsContainer = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  margin-bottom: 2rem;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    margin-top: 2rem;
    gap: 0.375rem;
  }
`;

export interface PaginationLinkProps {
  $isActive?: boolean;
}

export const PaginationLink = styled(Link)<PaginationLinkProps>`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  font-weight: ${(props) => (props.$isActive ? '600' : '400')};
  transition: all 0.2s ease;

  @media (max-width: 640px) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.875rem;
  }

  &:hover {
    background-color: #f3f4f6;
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$isActive &&
    css`
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;

      &:hover {
        background-color: #2563eb;
      }
    `}
`;
