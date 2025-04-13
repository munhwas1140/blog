import styled from 'styled-components';

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

export const Main = styled.main`
  max-width: 1280px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-grow: 1;
  padding-bottom: 2rem;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  margin-top: auto;
  width: 100%;
  min-height: 240px; /* height 대신 min-height 사용 */
`;

export const FooterContent = styled.div`
  max-width: 1280px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;
