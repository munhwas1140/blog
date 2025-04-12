"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Post } from "@/types";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled, { keyframes } from "styled-components";

interface PostClientProps {
  post: Post;
  htmlContent: string;
}

const ArticleContainer = styled.article`
  max-width: 48rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 3rem;

  @media (max-width: 640px) {
    padding-bottom: 2rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackLink = styled(Link)`
  color: #3b82f6;

  &:hover {
    text-decoration: underline;
  }
`;

const DeleteButton = styled.button`
  color: #ef4444;

  &:hover {
    color: #b91c1c;
  }
`;

const PostTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const ImageContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
  height: 24rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #f6f7f8;
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  z-index: 1;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

// Suspense를 사용한 이미지 컴포넌트 수정
function SuspenseImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onerror = () => {
      setError(true);
      console.error("이미지 로드 실패:", src);
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
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <p>이미지를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <PostImage
        ref={imgRef}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
    </div>
  );
}

const ContentContainer = styled.div`
  margin-bottom: 2.5rem;
  font-size: 1.125rem;
  line-height: 1.75;
  width: 100%;

  @media (max-width: 640px) {
    font-size: 1rem;
    line-height: 1.7;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 4px solid #e5e7eb;
    font-style: italic;
    margin: 1.5rem 0;
  }

  pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.375rem;
    margin: 1rem 0;
    overflow-x: auto;
  }

  code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }

  img {
    margin: 1rem auto;
    border-radius: 0.5rem;
  }
`;

const MetaContainer = styled.div`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const DateText = styled.p`
  margin-bottom: 1rem;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const CategorySpan = styled.span`
  display: inline-block;
`;

const CategoryLink = styled(Link)`
  color: #3b82f6;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const FooterContainer = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #3b82f6;
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 40;

  &:hover {
    background-color: #2563eb;
  }
`;

const ScrollIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 28rem;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const CancelButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;

  &:hover {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border-radius: 0.375rem;

  &:hover {
    background-color: #b91c1c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 마지막 방문 페이지 정보를 관리하는 훅
function useLastVisitedPage() {
  const searchParams = useSearchParams();

  // 세션 스토리지에 이전 페이지 정보 저장
  const saveLastVisitedState = useCallback(() => {
    if (typeof window !== "undefined") {
      const category =
        searchParams.get("refCategory") ||
        searchParams.get("category") ||
        localStorage.getItem("lastCategory") ||
        "all";
      const page =
        searchParams.get("refPage") ||
        searchParams.get("page") ||
        localStorage.getItem("lastPage") ||
        "1";

      const lastState = {
        category,
        page,
        timestamp: Date.now(),
      };

      sessionStorage.setItem("lastVisitedState", JSON.stringify(lastState));
      localStorage.setItem("lastCategory", category);
      localStorage.setItem("lastPage", page);
    }
  }, [searchParams]);

  // 이전 페이지 경로 가져오기
  const getLastVisitedPath = useCallback(() => {
    if (typeof window === "undefined") return "/";

    try {
      // 세션 스토리지에서 마지막 상태 가져오기
      const lastStateStr = sessionStorage.getItem("lastVisitedState");

      if (lastStateStr) {
        const lastState = JSON.parse(lastStateStr);
        // 24시간(86400000ms) 이내의 상태만 유효하게 처리
        if (Date.now() - lastState.timestamp < 86400000) {
          const params = new URLSearchParams();

          if (lastState.category && lastState.category !== "all") {
            params.set("category", lastState.category);
          }

          if (lastState.page && lastState.page !== "1") {
            params.set("page", lastState.page);
          }

          const queryString = params.toString();
          return queryString ? `/?${queryString}` : "/";
        }
      }

      // 로컬 스토리지에서 가져오기 (세션 스토리지에 없는 경우)
      const category = localStorage.getItem("lastCategory");
      const page = localStorage.getItem("lastPage");

      if (category || page) {
        const params = new URLSearchParams();

        if (category && category !== "all") {
          params.set("category", category);
        }

        if (page && page !== "1") {
          params.set("page", page);
        }

        const queryString = params.toString();
        return queryString ? `/?${queryString}` : "/";
      }
    } catch (e) {
      console.error("Failed to parse last visited state:", e);
    }

    return "/";
  }, []);

  return { saveLastVisitedState, getLastVisitedPath };
}

// 최근 게시물 컴포넌트 스타일링
const RecentPostsSection = styled.section`
  margin-top: 3rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
`;

const RecentPostsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const RecentPostsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const RecentPostCard = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const RecentPostLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const RecentPostImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  background-color: #f3f4f6;
`;

const RecentPostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RecentPostInfo = styled.div`
  padding: 1rem;
`;

const RecentPostTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RecentPostDate = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

// 최근 게시물용 Suspense 이미지 컴포넌트 수정
function RecentPostSuspenseImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onerror = () => {
      setError(true);
      console.error("이미지 로드 실패:", src);
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
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <p>이미지를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
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

export default function PostClient({ post, htmlContent }: PostClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveLastVisitedState, getLastVisitedPath } = useLastVisitedPage();

  // 이전 페이지 정보 저장 및 관리
  const [prevPageInfo, setPrevPageInfo] = useState({
    category: "",
    page: "1",
  });

  // 컴포넌트 마운트 시 이미지 URL과 이전 페이지 정보 설정
  useEffect(() => {
    // 이전 페이지 정보 저장
    saveLastVisitedState();

    // 이전 페이지 정보 가져오기
    const refererCategory =
      searchParams.get("refCategory") ||
      localStorage.getItem("lastCategory") ||
      "all";
    const refererPage =
      searchParams.get("refPage") || localStorage.getItem("lastPage") || "1";

    setPrevPageInfo({
      category: refererCategory,
      page: refererPage,
    });

    // 이미지 URL 설정
    if (post.thumbnail) {
      let url = post.thumbnail;
      if (!url.startsWith("/")) {
        url = `/${url}`;
      }
      setImageSrc(`${url}?t=${Date.now()}`);
    }

    // 최근 글 가져오기
    fetchRecentPosts();
  }, [post.thumbnail, searchParams, saveLastVisitedState]);

  // 최근 글 가져오기 함수
  const fetchRecentPosts = async () => {
    try {
      // API 호출
      const response = await fetch("/api/posts?limit=3");
      if (response.ok) {
        const data = await response.json();
        // 현재 글은 최근 글 목록에서 제외
        setRecentPosts(
          data.posts.filter((p: Post) => p.slug !== post.slug).slice(0, 3)
        );
      } else {
        console.error("최근 게시물 요청 실패:", response.status);
      }
    } catch (error) {
      console.error("최근 글을 불러오는데 실패했습니다:", error);
    }
  };

  // 이전 페이지로 돌아가는 함수 (버튼 클릭용)
  const handleBackToHome = useCallback(() => {
    const lastPath = getLastVisitedPath();
    router.push(lastPath);
  }, [getLastVisitedPath, router]);

  // 삭제 확인
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // 실제 삭제 처리
  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 삭제 성공 시 홈으로 이동
        router.push(getLastVisitedPath());
        router.refresh();
      } else {
        const data = await response.json();
        alert(`삭제 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      alert("글 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // 이미지 오류 처리
  const handleImageError = () => {
    setImageError(true);
  };

  // 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ArticleContainer>
      <HeaderContainer>
        <DeleteButton onClick={handleDeleteClick}>삭제</DeleteButton>
      </HeaderContainer>

      <PostTitle>{post.title}</PostTitle>

      {/* 전체 컨텐츠를 Suspense로 감싸서 UI 밀림 현상 방지 */}
      <Suspense
        fallback={
          <div
            style={{
              width: "100%",
              minHeight: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>콘텐츠를 불러오는 중...</div>
          </div>
        }
      >
        {/* 이미지 */}
        {imageSrc && !imageError && (
          <ImageContainer>
            <Suspense fallback={<SkeletonImage />}>
              <SuspenseImage
                src={imageSrc}
                alt={post.title || "게시물 이미지"}
              />
            </Suspense>
          </ImageContainer>
        )}

        {/* 본문 내용 */}
        <ContentContainer dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {/* 메타 정보 */}
        <MetaContainer>
          <DateText>{format(new Date(post.date), "yyyy년 M월 d일")}</DateText>

          {post.categories && post.categories.length > 0 && (
            <CategoriesContainer>
              <span>카테고리: </span>
              {post.categories.map((category, index) => (
                <CategorySpan key={category}>
                  <CategoryLink href={`/?category=${category}`}>
                    {category}
                  </CategoryLink>
                  {index < post.categories!.length - 1 && ", "}
                </CategorySpan>
              ))}
            </CategoriesContainer>
          )}
        </MetaContainer>

        <FooterContainer>
          <BackLink href={getLastVisitedPath()}>← 메인으로 돌아가기</BackLink>
        </FooterContainer>

        {/* 최근 게시물 섹션 */}
        {recentPosts.length > 0 && (
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
                              recentPost.thumbnail.startsWith("/")
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
                        {format(new Date(recentPost.date), "yyyy년 M월 d일")}
                      </RecentPostDate>
                    </RecentPostInfo>
                  </RecentPostLink>
                </RecentPostCard>
              ))}
            </RecentPostsList>
          </RecentPostsSection>
        )}
      </Suspense>

      <ScrollTopButton onClick={scrollToTop} aria-label="맨 위로 스크롤">
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

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>글 삭제 확인</ModalTitle>
            <ModalText>
              정말 이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </ModalText>

            <ModalButtonContainer>
              <CancelButton onClick={handleCancelDelete} disabled={isDeleting}>
                취소
              </CancelButton>
              <ConfirmButton
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </ConfirmButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </ArticleContainer>
  );
}
