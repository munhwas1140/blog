// 이 파일은 클라이언트에서 사용하는 함수들을 제공합니다.
// 서버 전용 기능은 호출하지 않습니다.
import { Post } from "@/types";

// 클라이언트에서 카테고리별 포스트 필터링 (데이터는 서버에서 가져온 후 필터링)
export function filterPostsByCategory(posts: Post[], category: string): Post[] {
  if (category === "all") {
    return posts;
  }

  return posts.filter(
    (post) => post.categories && post.categories.includes(category)
  );
}

// 클라이언트 측 유틸리티 함수들
export function formatPostPreview(
  content: string,
  length: number = 150
): string {
  return content.substring(0, length) + "...";
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
