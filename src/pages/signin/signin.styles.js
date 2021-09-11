import styled from "styled-components";
import { primary, white } from "../../configuration/theme";

export const ButtonBox = styled.div`
  padding-bottom: 10px;
  min-width: 250px;
`;

export const LockBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 50px;
  border-radius: 50%;

  background-color: ${primary};
  color: ${white};
  text-align: center;
  overflow: hidden;
`;
