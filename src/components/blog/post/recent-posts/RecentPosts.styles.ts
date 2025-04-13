'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { SuspenseImage } from '@/components';

export const RecentPostsSection = styled.section`
  margin-top: 3rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
`;

export const RecentPostsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const RecentPostsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const RecentPostCard = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const RecentPostLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

export const RecentPostImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  background-color: #f3f4f6;
`;

export const RecentPostSuspenseImage = styled(SuspenseImage)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export const RecentPostInfo = styled.div`
  padding: 1rem;
`;

export const RecentPostTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const RecentPostDate = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;
