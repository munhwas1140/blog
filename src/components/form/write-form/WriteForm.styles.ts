import styled from 'styled-components';

export const FormContainer = styled.form`
  & > * + * {
    margin-top: 1.5rem;
  }
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  height: 16rem;
  background-color: #f9fafb;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const UploadContainer = styled.div`
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export interface ButtonProps {
  disabled?: boolean;
}

export const UploadButton = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;

  &:hover {
    background-color: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const PreviewContainer = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: #dc2626;
  }
`;

export const SubmitContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export const SubmitButton = styled.button<ButtonProps>`
  background-color: black;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;

  &:hover {
    background-color: #1f2937;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
