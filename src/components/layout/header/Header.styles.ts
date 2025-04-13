import styled from 'styled-components';
import Link from 'next/link';

export const HeaderContainer = styled.header`
  min-width: 24rem;
  padding: 1.25rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f3f4f6;
  width: 100%;
`;

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const BlueLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #3b82f6;
  transform: rotate(45deg);
  transition: transform 0.3s ease;

  ${LogoLink}:hover & {
    transform: rotate(90deg);
  }
`;

export const GreenLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #22c55e;
  border-radius: 9999px;
  margin-left: -0.5rem;
  transition: transform 0.3s ease;

  ${LogoLink}:hover & {
    transform: scale(1.1);
  }
`;

export const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const WriteButton = styled(Link)`
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1f2937;
  }
`;

export const ThreeJsButton = styled(Link)`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4f46e5;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: rotate(45deg);
    background-color: #4338ca;
  }

  &:before {
    content: '';
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    background-color: #c4b5fd;
    border-radius: 0.2rem;
    animation: rotate 4s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &:after {
    content: '';
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    background-color: white;
    border-radius: 50%;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-5px);
    }
    50% {
      transform: translateY(5px);
    }
  }
`;
