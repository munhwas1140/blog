'use client';

import { useEffect, useRef, useState } from 'react';
import {
  RecentPostImage,
  ErrorContainer,
  ImageContainer,
} from './RecentPostSuspenseImage.styles';

export interface RecentPostSuspenseImageProps {
  src: string;
  alt: string;
}

function RecentPostSuspenseImage({ src, alt }: RecentPostSuspenseImageProps) {
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onerror = () => {
      setError(true);
      console.error('이미지 로드 실패:', src);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // 에러 처리
  if (error) {
    return (
      <ErrorContainer>
        <p>이미지를 불러올 수 없습니다</p>
      </ErrorContainer>
    );
  }

  return (
    <ImageContainer>
      <RecentPostImage
        ref={imgRef}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
    </ImageContainer>
  );
}

export default RecentPostSuspenseImage;
