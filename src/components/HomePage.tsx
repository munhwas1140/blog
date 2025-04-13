"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types";
import PostList from "./PostList";
import CategorySelector from "./CategorySelector";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styled from "styled-components";

interface HomePageProps {
  initialPosts: Post[];
  categories: string[];
}

const Container = styled.div`
  padding-bottom: 4rem;
`;

const HeaderSection = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MainTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #111827;
`;

const Description = styled.p`
  color: #6b7280;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

const EmptyPostsMessage = styled.div`
  background-color: #f9fafb;
  padding: 2.5rem;
  text-align: center;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-top: 2rem;
`;

const EmptyText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

// 스크롤 버튼 인터페이스 정의
interface ScrollTopButtonProps {
  show: boolean;
}

const ScrollTopButton = styled.button<ScrollTopButtonProps>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  z-index: 999; /* 더 높은 z-index 값 */
  opacity: ${(props) => (props.show ? "1" : "0")};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};

  &:hover {
    background-color: #e9ecef;
  }

  svg {
    font-size: 20px;
  }
`;

const ScrollIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  stroke-width: 2.5;
`;

export default function HomePage({ initialPosts, categories }: HomePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [currentCategory, setCurrentCategory] = useState(
    categoryParam || "all"
  );
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 스크롤 관련 효과
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // URL 쿼리 파라미터에서 카테고리 가져오기
  useEffect(() => {
    if (categoryParam !== null && categoryParam !== currentCategory) {
      setCurrentCategory(categoryParam);
    }
  }, [categoryParam, currentCategory]);

  // 카테고리 변경 시 필터링 다시 적용
  useEffect(() => {
    if (currentCategory === "all") {
      setFilteredPosts(initialPosts);
    } else {
      const filtered = initialPosts.filter(
        (post) => post.categories && post.categories.includes(currentCategory)
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

    if (category !== "all") {
      params.set("category", category);
    }

    params.set("page", "1");

    // 직접 URL을 변경하여 문제 해결
    window.location.href = `${pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 카테고리별 게시물 수 계산
  const getCategoryPostCount = (category: string) => {
    if (category === "all") {
      return initialPosts.length;
    }
    return initialPosts.filter(
      (post) => post.categories && post.categories.includes(category)
    ).length;
  };

  return (
    <Container>
      <HeaderSection>
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
            {currentCategory === "all"
              ? "아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요!"
              : `'${currentCategory}' 카테고리에 글이 없습니다.`}
          </EmptyText>
        </EmptyPostsMessage>
      )}

      {/* 무조건 스크롤 버튼 렌더링 하되 CSS로 보이거나 숨기게 함 */}
      <ScrollTopButton onClick={scrollToTop} show={showScrollTop}>
        <ScrollIcon
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </ScrollIcon>
      </ScrollTopButton>
    </Container>
  );
}
