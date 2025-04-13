import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

export const PostContainer = styled.div`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;

  /* 마지막 아이템에도 경계선 표시 */
  /* &:last-child {
    border-bottom: none;
  } */

  @media (max-width: 640px) {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }
`;

export const PostTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

export const PostTitleLink = styled(Link)`
  display: block;
  color: #111827;
  margin-bottom: 1.5rem; /* 제목과 이미지 사이 간격 증가 */

  &:hover ${PostTitle} {
    color: #2563eb;
  }
`;

export const ImageContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  height: 20rem;
  overflow: hidden;
  border-radius: 0.5rem;
  position: relative; /* 포지션 관계 설정 */
  background-color: #f6f7f8; /* 기본 배경색 */
`;
export const PostImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  z-index: 2; /* 스켈레톤 위에 표시 */
  opacity: 0; /* 처음에는 투명하게 시작 */

  &.loaded {
    opacity: 1; /* 로드 완료 시 불투명하게 변경 */
  }

  &:hover {
    transform: scale(1.02);
  }
`;

export const PostExcerpt = styled.p`
  color: #4b5563;
  margin-bottom: 1.25rem;
  line-height: 1.6;

  @media (max-width: 640px) {
    font-size: 0.9375rem;
    margin-bottom: 1rem;
  }
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  gap: 1rem;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    gap: 0.75rem;
  }
`;

export const CategoryContainer = styled.span`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

export const CategoryLabel = styled.span`
  color: #9ca3af;
  margin-right: 0.25rem;
`;

export const CategoryLink = styled(Link)`
  color: #3b82f6;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;
