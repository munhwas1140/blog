import { getAllPosts, getAllCategories } from "@/lib/server/posts";
import HomePage from "@/components/HomePage";
import { Suspense } from "react";

// 서버 컴포넌트 - 'use client' 지시문이 없음
export default function Page() {
  // 서버 컴포넌트에서 데이터 가져오기
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    // Suspense로 클라이언트 컴포넌트 감싸기
    <Suspense fallback={<div className="text-center py-10">로딩 중...</div>}>
      <HomePage initialPosts={posts} categories={categories} />
    </Suspense>
  );
}
