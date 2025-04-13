import styled from 'styled-components';

// 스크롤 버튼 인터페이스 정의
export interface ScrollTopButtonProps {
  $show: boolean;
}

export const Container = styled.div`
  padding-bottom: 4rem;
`;

export const HeaderSection = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MainTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #111827;
`;

export const Description = styled.p`
  color: #6b7280;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

export const EmptyPostsMessage = styled.div`
  background-color: #f9fafb;
  padding: 2.5rem;
  text-align: center;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-top: 2rem;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

export const ScrollTopButton = styled.button<ScrollTopButtonProps>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  z-index: 999; /* 더 높은 z-index 값 */
  opacity: ${(props) => (props.$show ? '1' : '0')};
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};

  &:hover {
    background-color: #e9ecef;
  }

  svg {
    font-size: 20px;
  }
`;
