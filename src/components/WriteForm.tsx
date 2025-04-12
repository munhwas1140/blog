"use client";

import { useState, FormEvent, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import CategoryInput from "./CategoryInput";
import styled from "styled-components";

const FormContainer = styled.form`
  & > * + * {
    margin-top: 1.5rem;
  }
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  height: 16rem;
  background-color: #f9fafb;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const UploadContainer = styled.div`
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const UploadButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;

  &:hover {
    background-color: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: #dc2626;
  }
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  background-color: black;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;

  &:hover {
    background-color: #1f2937;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>카테고리</Label>
        <CategoryInput
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
        />
      </FormGroup>

      <FormGroup>
        <Label>대표 이미지</Label>

        <UploadContainer>
          <UploadButton
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? "업로드 중..." : "이미지 업로드"}
          </UploadButton>

          <HiddenInput
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
          />

          {imagePreview && (
            <PreviewContainer>
              <PreviewImage src={imagePreview} alt="Thumbnail preview" />
              <RemoveButton
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setThumbnail(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                ×
              </RemoveButton>
            </PreviewContainer>
          )}
        </UploadContainer>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="content">내용</Label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          required
        />
      </FormGroup>

      <SubmitContainer>
        <SubmitButton type="submit" disabled={isSubmitting || uploadingImage}>
          {isSubmitting ? "저장 중..." : "저장하기"}
        </SubmitButton>
      </SubmitContainer>
    </FormContainer>
  );
}
