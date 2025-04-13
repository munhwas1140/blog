import styled from 'styled-components';

export const Container = styled.div``;

export const InputContainer = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const AddButton = styled.button`
  padding: 0 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

export const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const CategoryTag = styled.div`
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 0.875rem;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const CategoryText = styled.span``;

export const RemoveButton = styled.button`
  margin-left: 0.5rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;
