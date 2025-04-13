'use client';

import { Post } from '@/types';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Container,
  PostsContainer,
  PaginationContainer,
  PaginationLink,
} from './PostList.styles';
import { PostCard } from '@/components';

interface PostListProps {
  posts: Post[];
  currentCategory?: string;
}

export default function PostList({ posts, currentCategory }: PostListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // 페이지당 포스트 수
  const postsPerPage = 5;

  // 총 페이지 수 계산 (최소 1페이지)
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

  // 현재 페이지가 유효 범위를 벗어나면 1페이지로 리다이렉트
  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      updatePage(1);
    }
  }, [currentPage, totalPages]);

  // 현재 페이지에 표시할 포스트
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  // 페이지 변경 핸들러
  const updatePage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());

    // 카테고리가 있으면 유지
    if (currentCategory && currentCategory !== 'all') {
      params.set('category', currentCategory);
    } else if (params.has('category')) {
      params.delete('category');
    }

    // URL 업데이트 (히스토리 추가)
    router.push(`${pathname}?${params.toString()}`);

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지네이션 링크 생성
  const createPageLink = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());

    // 카테고리 유지
    if (currentCategory && currentCategory !== 'all') {
      params.set('category', currentCategory);
    } else {
      params.delete('category');
    }

    return `${pathname}?${params.toString()}`;
  };

  return (
    <Container>
      <PostsContainer>
        {currentPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </PostsContainer>

      {/* 페이지네이션 - 왼쪽 정렬 */}
      {totalPages > 1 && (
        <PaginationContainer>
          {/* 이전 페이지 */}
          {currentPage > 1 && (
            <PaginationLink href={createPageLink(currentPage - 1)}>
              &lt;
            </PaginationLink>
          )}

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationLink
              key={page}
              href={createPageLink(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          ))}

          {/* 다음 페이지 */}
          {currentPage < totalPages && (
            <PaginationLink href={createPageLink(currentPage + 1)}>
              &gt;
            </PaginationLink>
          )}
        </PaginationContainer>
      )}
    </Container>
  );
}
