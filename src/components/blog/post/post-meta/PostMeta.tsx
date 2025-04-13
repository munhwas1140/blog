'use client';

import { format } from 'date-fns';
import {
  MetaContainer,
  DateText,
  CategoriesContainer,
  CategorySpan,
  CategoryLink,
  FooterContainer,
  BackLink,
} from './PostMeta.styles';

interface PostMetaProps {
  date: string;
  categories?: string[];
}

function PostMeta({ date, categories }: PostMetaProps) {
  return (
    <>
      <MetaContainer>
        <DateText>{format(new Date(date), 'yyyy년 M월 d일')}</DateText>

        {categories && categories.length > 0 && (
          <CategoriesContainer>
            <span>카테고리: </span>
            {categories.map((category, index) => (
              <CategorySpan key={category}>
                <CategoryLink href={`/?category=${category}`}>
                  {category}
                </CategoryLink>
                {index < categories.length - 1 && ', '}
              </CategorySpan>
            ))}
          </CategoriesContainer>
        )}
      </MetaContainer>

      <FooterContainer>
        <BackLink href={'/'}>← 메인으로 돌아가기</BackLink>
      </FooterContainer>
    </>
  );
}

export default PostMeta;
