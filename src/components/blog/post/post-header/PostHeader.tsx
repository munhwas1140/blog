'use client';

import { HeaderContainer, DeleteButton, PostTitle } from './PostHeader.styles';

interface PostHeaderProps {
  title: string;
  onDeleteClick: () => void;
}

function PostHeader({ title, onDeleteClick }: PostHeaderProps) {
  return (
    <>
      <HeaderContainer>
        <DeleteButton onClick={onDeleteClick}>삭제</DeleteButton>
      </HeaderContainer>
      <PostTitle>{title}</PostTitle>
    </>
  );
}

export default PostHeader;
