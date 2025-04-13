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
} from '@/components';
import { styled } from 'styled-components';

const ArticleContainer = styled.article`
  max-width: 48rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 3rem;

  @media (max-width: 640px) {
    padding-bottom: 2rem;
  }
`;

interface PostClientProps {
  post: Post;
  htmlContent: string;
}

function PostClient({ post, htmlContent }: PostClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 이미지 소스 설정
    if (post.thumbnail) {
      setImageSrc(
        post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`,
      );
    }
  }, [post.thumbnail]);

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

  return (
    <ArticleContainer>
      <PostHeader title={post.title} onDeleteClick={handleDeleteClick} />

      <Suspense
        fallback={
          <div
            style={{
              width: '100%',
              minHeight: '50vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div>콘텐츠를 불러오는 중...</div>
          </div>
        }
      >
        <PostContent
          htmlContent={htmlContent}
          imageSrc={imageSrc}
          imageError={imageError}
          title={post.title}
        />

        <PostMeta date={post.date} categories={post.categories} />

        <RecentPosts currentPostSlug={post.slug} />
      </Suspense>

      <ScrollTopButton />

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

export default PostClient;
