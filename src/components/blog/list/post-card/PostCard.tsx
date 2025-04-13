'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/types';
import { useState, useEffect, Suspense } from 'react';
import {
  PostContainer,
  PostTitle,
  PostTitleLink,
  ImageContainer,
  SkeletonImage,
  PostExcerpt,
  MetaContainer,
  CategoryContainer,
  CategoryLabel,
  CategoryLink,
} from './PostCard.styles';
import { SuspenseImage } from '@/components';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // 컴포넌트 마운트 시 이미지 URL 설정
  useEffect(() => {
    if (post.thumbnail) {
      // 이미지 URL 정규화
      let url = post.thumbnail;
      if (!url.startsWith('/')) {
        url = `/${url}`;
      }

      // 이미지 캐싱을 방지하기 위한 타임스탬프 추가
      setImageSrc(`${url}?t=${Date.now()}`);
    }
  }, [post.thumbnail]);

  // 이미지 오류 처리를 위한 함수
  const handleImageError = () => {
    setImageError(true);
  };

  const hasImage = !!post.thumbnail && !imageError;

  return (
    <PostContainer>
      {hasImage && (
        <Link href={`/${post.slug}`}>
          <ImageContainer>
            {imageSrc && (
              <Suspense fallback={<SkeletonImage isLoaded={false} />}>
                <SuspenseImage
                  src={imageSrc}
                  alt={post.title || '게시물 이미지'}
                />
              </Suspense>
            )}
          </ImageContainer>
        </Link>
      )}

      <PostTitleLink href={`/${post.slug}`}>
        <PostTitle>{post.title}</PostTitle>
      </PostTitleLink>

      <PostExcerpt>
        {post.excerpt || post.content.substring(0, 150) + '...'}
      </PostExcerpt>

      <MetaContainer>
        <span>{format(new Date(post.date), 'yyyy년 M월 d일')}</span>

        {post.categories && post.categories.length > 0 && (
          <CategoryContainer>
            <CategoryLabel>카테고리:</CategoryLabel>
            {post.categories.map((category, index) => (
              <span key={category}>
                <CategoryLink href={`/?category=${category}`}>
                  {category}
                </CategoryLink>
                {index < post.categories!.length - 1 && ', '}
              </span>
            ))}
          </CategoryContainer>
        )}
      </MetaContainer>
    </PostContainer>
  );
}
