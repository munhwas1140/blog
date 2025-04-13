import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 56rem;
  gap: 0.5rem;
  width: 100%;
  padding: 0 1rem;

  @media (max-width: 640px) {
    gap: 0.375rem;
  }
`;

export interface CategoryButtonProps {
  isActive: boolean;
}

export const CategoryButton = styled.button<CategoryButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
  }

  ${(props) =>
    props.isActive
      ? css`
          background-color: #3b82f6;
          color: white;
          &:hover {
            background-color: #2563eb;
          }
        `
      : css`
          background-color: #f3f4f6;
          color: #4b5563;
          &:hover {
            background-color: #e5e7eb;
          }
        `}
`;
