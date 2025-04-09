"use client";

import { useState, FormEvent, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import CategoryInput from "./CategoryInput";

export default function WriteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 임시 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 서버에 이미지 업로드
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setThumbnail(data.url);
      } else {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // 안전한 슬러그 생성 함수
  const generateSafeSlug = (text: string): string => {
    // 타임스탬프 추가
    const timestamp = Date.now();

    // 슬러그에 한글이 포함되어도 괜찮지만, 특수 문자는 처리
    const safeSlug = text
      .trim()
      .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, "-") // 영문, 숫자, 한글이 아닌 문자는 하이픈으로
      .replace(/-+/g, "-") // 중복 하이픈 제거
      .replace(/^-|-$/g, ""); // 시작/끝 하이픈 제거

    // 최종 슬러그는 원본 텍스트와 타임스탬프 조합
    return `${safeSlug}-${timestamp}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 직접 슬러그 생성 (한글 처리를 위해)
      const slug = generateSafeSlug(title);

      const postData = {
        title,
        content,
        categories,
        thumbnail,
        slug,
        date: new Date().toISOString(),
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      alert(
        `글 저장에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoriesChange = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <CategoryInput
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          대표 이미지
        </label>

        <div className="mt-1 flex items-center space-x-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
            disabled={uploadingImage}
          >
            {uploadingImage ? "업로드 중..." : "이미지 업로드"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {imagePreview && (
            <div className="relative w-24 h-24">
              <img
                src={imagePreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setThumbnail(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="w-full p-3 border border-gray-300 rounded-md h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
