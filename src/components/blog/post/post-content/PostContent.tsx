'use client';

import { Suspense } from 'react';
import { SuspenseImage } from '@/components/common/suspense';
import { ImageContainer, ContentContainer } from './PostContent.styles';
import { Post } from '@/types';

interface PostContentProps {
  htmlContent: string;
  post: Post;
}

function PostContent({ htmlContent, post }: PostContentProps) {
  return (
    <>
      {post.thumbnail && (
        <ImageContainer>
          <SuspenseImage
            src={
              post.thumbnail.startsWith('/')
                ? post.thumbnail
                : `/${post.thumbnail}`
            }
            alt={post.title || '게시물 이미지'}
          />
        </ImageContainer>
      )}

      {/* 본문 내용 */}
      <ContentContainer dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

export default PostContent;
