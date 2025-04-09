import { NextRequest, NextResponse } from "next/server";
import { savePost } from "@/lib/server/posts";
import { Post } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const postData: Post = await request.json();

    // 필수 필드 확인
    if (!postData.title || !postData.content) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // slug 생성 (서버 측에서 처리)
    if (!postData.slug) {
      const timestamp = Date.now();
      postData.slug =
        postData.title
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        timestamp;
    }

    // date가 없으면 현재 시간으로 설정
    if (!postData.date) {
      postData.date = new Date().toISOString();
    }

    // categories가 undefined인 경우 빈 배열로 초기화
    if (!postData.categories) {
      postData.categories = [];
    }

    const success = await savePost(postData);

    if (success) {
      return NextResponse.json({ success: true, slug: postData.slug });
    } else {
      return NextResponse.json(
        { error: "Failed to save post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 추가
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
