"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types";
import { useState, useEffect, useRef, Suspense } from "react";
import styled, { keyframes } from "styled-components";

interface PostCardProps {
  post: Post;
}

const PostContainer = styled.div`
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

const PostTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const PostTitleLink = styled(Link)`
  display: block;
  color: #111827;
  margin-bottom: 1.5rem; /* 제목과 이미지 사이 간격 증가 */

  &:hover ${PostTitle} {
    color: #2563eb;
  }
`;

const ImageContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  height: 20rem;
  overflow: hidden;
  border-radius: 0.5rem;
  position: relative; /* 포지션 관계 설정 */
  background-color: #f6f7f8; /* 기본 배경색 */
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonImage = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  z-index: 1; /* 이미지 아래에 위치 */
  opacity: ${(props) => (props.isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const PostImage = styled.img`
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

const PostExcerpt = styled.p`
  color: #4b5563;
  margin-bottom: 1.25rem;
  line-height: 1.6;

  @media (max-width: 640px) {
    font-size: 0.9375rem;
    margin-bottom: 1rem;
  }
`;

const MetaContainer = styled.div`
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

const CategoryContainer = styled.span`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const CategoryLabel = styled.span`
  color: #9ca3af;
  margin-right: 0.25rem;
`;

const CategoryLink = styled(Link)`
  color: #3b82f6;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

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
    console.error("이미지 로드 실패:", src);
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
      className={loaded ? "loaded" : ""}
    />
  );
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // 컴포넌트 마운트 시 이미지 URL 설정
  useEffect(() => {
    if (post.thumbnail) {
      // 이미지 URL 정규화
      let url = post.thumbnail;
      if (!url.startsWith("/")) {
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
      <PostTitleLink href={`/${post.slug}`}>
        <PostTitle>{post.title}</PostTitle>
      </PostTitleLink>

      {hasImage && (
        <Link href={`/${post.slug}`}>
          <ImageContainer>
            {imageSrc && (
              <Suspense fallback={<SkeletonImage isLoaded={false} />}>
                <SuspenseImage
                  src={imageSrc}
                  alt={post.title || "게시물 이미지"}
                />
              </Suspense>
            )}
          </ImageContainer>
        </Link>
      )}

      <PostExcerpt>
        {post.excerpt || post.content.substring(0, 150) + "..."}
      </PostExcerpt>

      <MetaContainer>
        <span>{format(new Date(post.date), "yyyy년 M월 d일")}</span>

        {post.categories && post.categories.length > 0 && (
          <CategoryContainer>
            <CategoryLabel>카테고리:</CategoryLabel>
            {post.categories.map((category, index) => (
              <span key={category}>
                <CategoryLink href={`/?category=${category}`}>
                  {category}
                </CategoryLink>
                {index < post.categories!.length - 1 && ", "}
              </span>
            ))}
          </CategoryContainer>
        )}
      </MetaContainer>
    </PostContainer>
  );
}
