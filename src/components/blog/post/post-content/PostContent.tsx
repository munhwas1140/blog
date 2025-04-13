'use client';

import { Suspense } from 'react';
import { SuspenseImage } from '@/components';
import {
  ImageContainer,
  ContentContainer,
  SkeletonImage,
} from './PostContent.styles';

interface PostContentProps {
  htmlContent: string;
  imageSrc: string | null;
  imageError: boolean;
  title: string;
}

function PostContent({
  htmlContent,
  imageSrc,
  imageError,
  title,
}: PostContentProps) {
  return (
    <>
      {/* 이미지 */}
      {imageSrc && !imageError && (
        <ImageContainer>
          <Suspense fallback={<SkeletonImage />}>
            <SuspenseImage src={imageSrc} alt={title || '게시물 이미지'} />
          </Suspense>
        </ImageContainer>
      )}

      {/* 본문 내용 */}
      <ContentContainer dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

export default PostContent;
