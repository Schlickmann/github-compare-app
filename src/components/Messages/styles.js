import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  padding: 20px 10px;
  font-size: 18px;
  border-left: ${props =>
    props.repositoryError ? "10px solid #BA2A26" : "10px solid #2F6D3D"};
  color: ${props => (props.repositoryError ? "#BA2A26" : "#2F6D3D")};
  background: ${props => (props.repositoryError ? "#E394A2" : "#B1F1C1")};
  opacity: ${props => (props.repositoryMessage ? 1 : 0)};
`;
