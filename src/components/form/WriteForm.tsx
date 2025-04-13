'use client';

import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  TextArea,
  UploadContainer,
  UploadButton,
  HiddenInput,
  PreviewContainer,
  PreviewImage,
  RemoveButton,
  SubmitContainer,
  SubmitButton,
} from './WriteForm.styles';
import { CategoryInput } from '@/components';

export default function WriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
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
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setThumbnail(data.url);
      } else {
        throw new Error('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.');
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
      .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '-') // 영문, 숫자, 한글이 아닌 문자는 하이픈으로
      .replace(/-+/g, '-') // 중복 하이픈 제거
      .replace(/^-|-$/g, ''); // 시작/끝 하이픈 제거

    // 최종 슬러그는 원본 텍스트와 타임스탬프 조합
    return `${safeSlug}-${timestamp}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
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

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(`저장에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('글 작성 중 오류 발생:', error);
      alert('글을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
    setImagePreview(null);

    // 파일 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
          required
          placeholder="글 제목을 입력하세요"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="content">내용</Label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="글 내용을 입력하세요"
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
        <Label>썸네일 이미지</Label>
        <UploadContainer>
          <UploadButton
            type="button"
            onClick={handleBrowseClick}
            disabled={uploadingImage}
          >
            {uploadingImage ? '업로드 중...' : '이미지 찾아보기'}
          </UploadButton>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {imagePreview && (
            <PreviewContainer>
              <PreviewImage src={imagePreview} alt="썸네일 미리보기" />
              <RemoveButton type="button" onClick={handleRemoveImage}>
                ×
              </RemoveButton>
            </PreviewContainer>
          )}
        </UploadContainer>
      </FormGroup>

      <SubmitContainer>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '글 작성 완료'}
        </SubmitButton>
      </SubmitContainer>
    </FormContainer>
  );
}
