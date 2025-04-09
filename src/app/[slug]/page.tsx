import { getPostBySlug, markdownToHtml, getAllPosts } from "@/lib/server/posts";
import { notFound } from "next/navigation";
import PostClient from "./page.client";

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // 슬러그 정규화 (URL 디코딩)
    const normalizedSlug = decodeURIComponent(params.slug);

    // 디버깅 정보 출력 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log("요청된 슬러그:", params.slug);
      console.log("정규화된 슬러그:", normalizedSlug);
    }

    // 포스트 가져오기
    const post = getPostBySlug(normalizedSlug);

    if (!post) {
      console.error(`포스트를 찾을 수 없음: ${normalizedSlug}`);
      notFound();
    }

    // HTML 변환
    const htmlContent = await markdownToHtml(post.content);

    return <PostClient post={post} htmlContent={htmlContent} />;
  } catch (error) {
    console.error("페이지 렌더링 오류:", error);
    notFound();
  }
}
