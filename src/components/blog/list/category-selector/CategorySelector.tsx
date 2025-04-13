'use client';

import {
  Container,
  ButtonsContainer,
  CategoryButton,
} from './CategorySelector.styles';

interface CategorySelectorProps {
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  getCategoryPostCount: (category: string) => number;
}

export default function CategorySelector({
  categories,
  currentCategory,
  onCategoryChange,
  getCategoryPostCount,
}: CategorySelectorProps) {
  return (
    <Container>
      <ButtonsContainer>
        <CategoryButton
          onClick={() => onCategoryChange('all')}
          $isActive={currentCategory === 'all'}
          type="button"
        >
          All ({getCategoryPostCount('all')})
        </CategoryButton>

        {categories.map((category) => (
          <CategoryButton
            key={category}
            onClick={() => onCategoryChange(category)}
            $isActive={currentCategory === category}
            type="button"
          >
            {category} ({getCategoryPostCount(category)})
          </CategoryButton>
        ))}
      </ButtonsContainer>
    </Container>
  );
}
