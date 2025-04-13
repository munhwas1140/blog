'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const MetaContainer = styled.div`
  color: #6b7280;
  margin-bottom: 2rem;
`;

export const DateText = styled.p`
  margin-bottom: 1rem;
`;

export const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const CategorySpan = styled.span`
  display: inline-block;
`;

export const CategoryLink = styled(Link)`
  color: #3b82f6;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export const FooterContainer = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

export const BackLink = styled(Link)`
  color: #3b82f6;

  &:hover {
    text-decoration: underline;
  }
`;
