'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import TitleIcon from '../../../../../public/title.svg';
import {
  Container,
  HeaderSection,
  MainTitle,
  Description,
  EmptyPostsMessage,
  EmptyText,
  ScrollTopButton,
} from './HomePage.styles';
import { PostList, CategorySelector, ChevronUpIcon } from '@/components';

interface HomePageProps {
  initialPosts: Post[];
  categories: string[];
}

export default function HomePage({ initialPosts, categories }: HomePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [currentCategory, setCurrentCategory] = useState(
    categoryParam || 'all',
  );
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 스크롤 관련 효과
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // URL 쿼리 파라미터에서 카테고리 가져오기
  useEffect(() => {
    if (categoryParam !== null && categoryParam !== currentCategory) {
      setCurrentCategory(categoryParam);
    }
  }, [categoryParam, currentCategory]);

  // 카테고리 변경 시 필터링 다시 적용
  useEffect(() => {
    if (currentCategory === 'all') {
      setFilteredPosts(initialPosts);
    } else {
      const filtered = initialPosts.filter(
        (post) => post.categories && post.categories.includes(currentCategory),
      );
      setFilteredPosts(filtered);
    }
  }, [currentCategory, initialPosts]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    // 이미 같은 카테고리를 선택한 경우 아무 작업도 하지 않음
    if (category === currentCategory) return;

    // 카테고리 변경 시 즉시 상태 업데이트
    setCurrentCategory(category);
    setCurrentPage(1);

    // URL 변경 및 페이지 이동 (강제 리로드)
    const params = new URLSearchParams();

    if (category !== 'all') {
      params.set('category', category);
    }

    params.set('page', '1');

    // 직접 URL을 변경하여 문제 해결
    window.location.href = `${pathname}${
      params.toString() ? `?${params.toString()}` : ''
    }`;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 카테고리별 게시물 수 계산
  const getCategoryPostCount = (category: string) => {
    if (category === 'all') {
      return initialPosts.length;
    }
    return initialPosts.filter(
      (post) => post.categories && post.categories.includes(category),
    ).length;
  };

  return (
    <Container>
      <HeaderSection>
        <TitleIcon />
        <MainTitle>소리의 일기</MainTitle>
        <Description>
          옛날 옛적 소리라는 아이가 살았습니다.
          <br />
          소리는 디자인을 공부하는 학생이고, 미소녀에요.
          <br />
          그리고 4학년이 나오는 애니메이션을 보는 걸 좋아해요.
        </Description>
      </HeaderSection>

      <CategorySelector
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        getCategoryPostCount={getCategoryPostCount}
      />

      {filteredPosts.length > 0 ? (
        <PostList posts={filteredPosts} currentCategory={currentCategory} />
      ) : (
        <EmptyPostsMessage>
          <EmptyText>
            {currentCategory === 'all'
              ? '아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요!'
              : `'${currentCategory}' 카테고리에 글이 없습니다.`}
          </EmptyText>
        </EmptyPostsMessage>
      )}

      {/* 무조건 스크롤 버튼 렌더링 하되 CSS로 보이거나 숨기게 함 */}
      <ScrollTopButton onClick={scrollToTop} $show={showScrollTop}>
        <ChevronUpIcon strokeWidth={2.5} />
      </ScrollTopButton>
    </Container>
  );
}
