'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/types';
import { useState, useEffect, useRef, Suspense } from 'react';
import {
  PostContainer,
  PostTitle,
  PostTitleLink,
  ImageContainer,
  SkeletonImage,
  PostImage,
  PostExcerpt,
  MetaContainer,
  CategoryContainer,
  CategoryLabel,
  CategoryLink,
} from './PostCard.styles';

// SuspenseImage 컴포넌트를 로컬로 유지합니다
// 이미지 로딩을 위한 Suspense 이미지 컴포넌트
function SuspenseImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 이미지 로드 완료 처리
  const handleImageLoad = () => {
    setLoaded(true);
  };

  // 이미지 로드 오류 처리
  const handleImageError = () => {
    console.error('이미지 로드 실패:', src);
  };

  // 이미 캐시된 이미지인지 확인
  useEffect(() => {
    if (imageRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <PostImage
      ref={imageRef}
      src={src}
      alt={alt}
      onError={handleImageError}
      onLoad={handleImageLoad}
      className={loaded ? 'loaded' : ''}
    />
  );
}

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
