'use client';

import { useState, useEffect, Suspense } from 'react';
import { format } from 'date-fns';
import { Post } from '@/types';
import {
  RecentPostsSection,
  RecentPostsTitle,
  RecentPostsList,
  RecentPostCard,
  RecentPostLink,
  RecentPostImageContainer,
  RecentPostSuspenseImage,
  RecentPostInfo,
  RecentPostTitle,
  RecentPostDate,
  SkeletonImage,
} from './RecentPosts.styles';

interface RecentPostsProps {
  currentPostSlug: string;
}

function RecentPosts({ currentPostSlug }: RecentPostsProps) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=3');
        if (response.ok) {
          const data = await response.json();
          setRecentPosts(
            data.posts
              .filter((p: Post) => p.slug !== currentPostSlug)
              .slice(0, 3),
          );
        } else {
          console.error('최근 게시물 요청 실패:', response.status);
        }
      } catch (error) {
        console.error('최근 글을 불러오는데 실패했습니다:', error);
      }
    };

    fetchRecentPosts();
  }, [currentPostSlug]);

  if (recentPosts.length === 0) return null;

  return (
    <RecentPostsSection>
      <RecentPostsTitle>최근 게시물</RecentPostsTitle>
      <RecentPostsList>
        {recentPosts.map((recentPost) => (
          <RecentPostCard key={recentPost.slug}>
            <RecentPostLink href={`/${recentPost.slug}`}>
              {recentPost.thumbnail && (
                <RecentPostImageContainer>
                  <Suspense fallback={<SkeletonImage />}>
                    <RecentPostSuspenseImage
                      src={
                        recentPost.thumbnail.startsWith('/')
                          ? recentPost.thumbnail
                          : `/${recentPost.thumbnail}`
                      }
                      alt={recentPost.title}
                    />
                  </Suspense>
                </RecentPostImageContainer>
              )}
              <RecentPostInfo>
                <RecentPostTitle>{recentPost.title}</RecentPostTitle>
                <RecentPostDate>
                  {format(new Date(recentPost.date), 'yyyy년 M월 d일')}
                </RecentPostDate>
              </RecentPostInfo>
            </RecentPostLink>
          </RecentPostCard>
        ))}
      </RecentPostsList>
    </RecentPostsSection>
  );
}

export default RecentPosts;
