'use client';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

const RecentPostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 최근 게시물용 Suspense 이미지 컴포넌트 수정
export default function RecentPostSuspenseImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
        <p>이미지를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <RecentPostImage
        ref={imgRef}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
    </div>
  );
}
