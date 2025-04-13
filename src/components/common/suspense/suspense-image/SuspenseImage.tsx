'use client';

import { useEffect, useRef, useState } from 'react';
import {
  SkeletonLoader,
  PostImage,
  ErrorContainer,
  ImageContainer,
} from './SuspenseImage.styles';

export interface SuspenseImageProps {
  src: string;
  alt: string;
}

function SuspenseImage({ src, alt }: SuspenseImageProps) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
    };

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
      {!isLoaded && <SkeletonLoader />}
      <PostImage
        ref={imgRef}
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className={isLoaded ? 'loaded' : ''}
        onLoad={() => setIsLoaded(true)}
      />
    </ImageContainer>
  );
}

export default SuspenseImage;
