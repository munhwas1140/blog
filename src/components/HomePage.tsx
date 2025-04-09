"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types";
import PostList from "./PostList";
import CategorySelector from "./CategorySelector";
import { filterPostsByCategory } from "@/lib/posts";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface HomePageProps {
  initialPosts: Post[];
  categories: string[];
}

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

  // 스크롤 관련 효과
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
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

  const handleCategoryChange = (category: string) => {
    // URL 업데이트 (쿼리 파라미터)
    const params = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    // 페이지를 1로 리셋
    params.set("page", "1");

    // URL 업데이트
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);

    setCurrentCategory(category);
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
    <div className="pb-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">소리의 일기</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          옛날 옛적 소리라는 아이가 살았습니다.
          <br />
          소리는 디자인을 공부하는 학생이고, 미소녀에요.
          <br />
          그리고 4학녀이 나오는 애니메이션을 보는 걸 좋아해요.
        </p>
      </div>

      <CategorySelector
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        getCategoryPostCount={getCategoryPostCount}
      />

      {filteredPosts.length > 0 ? (
        <PostList posts={filteredPosts} currentCategory={currentCategory} />
      ) : (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-600">
            {currentCategory === "all"
              ? "아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요!"
              : `'${currentCategory}' 카테고리에 글이 없습니다.`}
          </p>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all"
          aria-label="맨 위로 스크롤"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
