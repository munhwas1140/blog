"use client";

import { Post } from "@/types";
import PostCard from "./PostCard";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PostListProps {
  posts: Post[];
  currentCategory?: string;
}

export default function PostList({ posts, currentCategory }: PostListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // 페이지당 포스트 수
  const postsPerPage = 5;

  // 총 페이지 수 계산 (최소 1페이지)
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

  // 현재 페이지가 유효 범위를 벗어나면 1페이지로 리다이렉트
  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      updatePage(1);
    }
  }, [currentPage, totalPages]);

  // 현재 페이지에 표시할 포스트
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // 페이지 변경 핸들러
  const updatePage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());

    // 카테고리가 있으면 유지
    if (currentCategory && currentCategory !== "all") {
      params.set("category", currentCategory);
    } else if (params.has("category")) {
      params.delete("category");
    }

    // URL 업데이트 (히스토리 추가)
    router.push(`${pathname}?${params.toString()}`);

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지네이션 링크 생성
  const createPageLink = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="space-y-0">
      <div className="border-b border-gray-200 mb-6">
        {currentPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* 페이지네이션 - 왼쪽 정렬 */}
      {totalPages > 1 && (
        <div className="flex mt-10 mb-10 space-x-2">
          {/* 이전 페이지 */}
          {currentPage > 1 && (
            <Link
              href={createPageLink(currentPage - 1)}
              className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100"
            >
              &lt;
            </Link>
          )}

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={createPageLink(page)}
              className={`w-10 h-10 flex items-center justify-center border rounded-full ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          ))}

          {/* 다음 페이지 */}
          {currentPage < totalPages && (
            <Link
              href={createPageLink(currentPage + 1)}
              className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100"
            >
              &gt;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
