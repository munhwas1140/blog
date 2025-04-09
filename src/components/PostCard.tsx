import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types";
import { useState, useEffect } from "react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // 컴포넌트 마운트 시 이미지 URL 설정
  useEffect(() => {
    if (post.thumbnail) {
      // 이미지 URL 정규화
      let url = post.thumbnail;
      if (!url.startsWith("/")) {
        url = `/${url}`;
      }
      setImageSrc(url);
    }
  }, [post.thumbnail]);

  // 이미지 로드 오류 처리
  const handleImageError = () => {
    setImageError(true);
    // 에러 발생 시 콘솔 로그 출력 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.error("이미지 로드 실패:", post.thumbnail);
    }
  };

  return (
    <div className="py-6">
      <Link href={`/${post.slug}`} className="block mb-3">
        <h2 className="text-xl font-bold hover:text-blue-600">{post.title}</h2>
      </Link>

      {imageSrc && !imageError && (
        <div className="mb-4">
          <img
            src={imageSrc}
            alt={post.title || "게시물 이미지"}
            className="w-full max-h-64 object-cover rounded-lg"
            onError={handleImageError}
          />
        </div>
      )}

      <p className="text-gray-700 mb-5">
        {post.excerpt || post.content.substring(0, 150) + "..."}
      </p>

      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
        <span>{format(new Date(post.date), "yyyy년 M월 d일")}</span>

        {post.categories && post.categories.length > 0 && (
          <span className="ml-4">
            <span className="text-gray-400">카테고리:</span>{" "}
            {post.categories.map((category, index) => (
              <span key={category}>
                <span className="text-blue-500">{category}</span>
                {index < post.categories!.length - 1 && ", "}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
