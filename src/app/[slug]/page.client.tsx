"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Post } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PostClientProps {
  post: Post;
  htmlContent: string;
}

export default function PostClient({ post, htmlContent }: PostClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const router = useRouter();

  // 컴포넌트 마운트 시 이미지 URL 설정
  useEffect(() => {
    if (post.thumbnail) {
      // 이미지 URL 정규화 및 캐시 방지
      let url = post.thumbnail;
      if (!url.startsWith("/")) {
        url = `/${url}`;
      }
      // 캐시 방지를 위한 쿼리 파라미터 추가
      setImageSrc(`${url}?t=${Date.now()}`);
    }
  }, [post.thumbnail]);

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
        router.push("/");
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
    if (process.env.NODE_ENV === "development") {
      console.error("이미지 로드 실패:", post.thumbnail);
    }
  };

  // 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <article className="max-w-3xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 메인으로 돌아가기
        </Link>
        <button
          onClick={handleDeleteClick}
          className="text-red-500 hover:text-red-700"
        >
          삭제
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {imageSrc && !imageError && (
        <div className="mb-8 relative">
          <img
            src={imageSrc}
            alt={post.title || "게시물 이미지"}
            className="w-full max-h-96 object-cover rounded-lg"
            onError={handleImageError}
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div className="text-gray-500 mb-8">
        <p className="mb-4">{format(new Date(post.date), "yyyy년 M월 d일")}</p>

        {post.categories && post.categories.length > 0 && (
          <div className="mb-6">
            <span className="text-gray-600">카테고리: </span>
            {post.categories.map((category, index) => (
              <span key={category} className="inline-block">
                <span className="text-blue-500">{category}</span>
                {index < post.categories!.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 메인으로 돌아가기
        </Link>
      </div>

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

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">글 삭제 확인</h3>
            <p className="mb-6">
              정말 이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
