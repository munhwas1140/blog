'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import {
  PostHeader,
  PostContent,
  PostMeta,
  RecentPosts,
  DeleteConfirmModal,
  ScrollTopButton,
  ChevronUpIcon,
} from '@/components';
import { styled } from 'styled-components';

const ArticleContainer = styled.article`
  width: 100%;
  overflow-x: hidden; /* 수평 스크롤 방지 */
  contain: paint; /* 레이아웃 시프트 방지 */
  min-height: 80vh;
`;

interface PostClientProps {
  post: Post;
  htmlContent: string;
}

function PostClient({ post, htmlContent }: PostClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 이미지 소스 설정
    if (post.thumbnail) {
      setImageSrc(
        post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`,
      );
    }
  }, [post.thumbnail]);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 삭제 확인
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // 실제 삭제 처리
  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/posts/${post.slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 삭제 성공 시 홈으로 이동
        router.back();
        router.refresh();
      } else {
        const data = await response.json();
        alert(`삭제 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert('글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <ArticleContainer>
      <PostHeader title={post.title} onDeleteClick={handleDeleteClick} />

      <PostContent htmlContent={htmlContent} post={post} />

      <PostMeta date={post.date} categories={post.categories} />

      <RecentPosts currentPostSlug={post.slug} />

      {/* 스크롤 버튼 */}
      <StyledScrollTopButton onClick={scrollToTop} $show={showScrollTop}>
        <ChevronUpIcon strokeWidth={2.5} />
      </StyledScrollTopButton>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isDeleting={isDeleting}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </ArticleContainer>
  );
}

// ScrollTopButton 스타일 컴포넌트 정의
const StyledScrollTopButton = styled.button<{ $show: boolean }>`
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
  opacity: ${(props) => (props.$show ? '1' : '0')};
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};

  &:hover {
    background-color: #2563eb;
  }
`;

export default PostClient;
