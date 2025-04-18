'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Container,
  InputContainer,
  StyledInput,
  AddButton,
  CategoriesContainer,
  CategoryTag,
  CategoryText,
  RemoveButton,
} from './CategoryInput.styles';

interface CategoryInputProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function CategoryInput({
  categories,
  onCategoriesChange,
}: CategoryInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 카테고리 추가 함수
  const addCategory = () => {
    const value = inputValue.trim();
    if (!value) return;

    // 중복 확인 (대소문자 구분 없이)
    const isDuplicate = categories.some(
      (category) => category.toLowerCase() === value.toLowerCase(),
    );

    if (!isDuplicate) {
      const newCategories = [...categories, value];
      onCategoriesChange(newCategories);

      // 디버깅: 카테고리 추가 확인
      console.log('카테고리 추가됨:', value);
      console.log('현재 카테고리 목록:', newCategories);
    } else {
      console.log('중복된 카테고리:', value);
    }

    // 입력값 초기화
    setInputValue('');
  };

  // 버튼 클릭으로 카테고리 추가
  const handleAddButtonClick = () => {
    addCategory();
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 현재 IME 조합 중이면 처리하지 않음
    if (isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  // 카테고리 삭제
  const removeCategory = (categoryToRemove: string) => {
    const newCategories = categories.filter(
      (category) => category !== categoryToRemove,
    );
    onCategoriesChange(newCategories);
    console.log('카테고리 삭제됨:', categoryToRemove);
  };

  // 컴포넌트 마운트/언마운트 시 입력 필드 초기화
  useEffect(() => {
    return () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };
  }, []);

  return (
    <Container>
      <InputContainer>
        <StyledInput
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="카테고리를 입력하고 Enter를 누르세요"
        />
        <AddButton type="button" onClick={handleAddButtonClick}>
          추가
        </AddButton>
      </InputContainer>

      {categories.length > 0 && (
        <CategoriesContainer>
          {categories.map((category) => (
            <CategoryTag key={category}>
              <CategoryText>{category}</CategoryText>
              <RemoveButton
                type="button"
                onClick={() => removeCategory(category)}
              >
                ×
              </RemoveButton>
            </CategoryTag>
          ))}
        </CategoriesContainer>
      )}
    </Container>
  );
}
