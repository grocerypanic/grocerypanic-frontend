import styled from "styled-components";
import { white, tertiary, error } from "../../configuration/theme";

export const NotePad = styled.ul`
  padding-left: 0px;
  margin: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 10px;
`;

export const Page = styled.div`
  margin: 0px;
  min-width: 200px;
  padding: 10px;
`;

export const OK = styled.button`
  margin-top: 10px;
`;

export const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 50px;
  border-radius: 50%;

  background-color: ${error};
  color: ${white};
  text-align: center;
  overflow: hidden;
`;

export const Centered = styled.div`
  text-align: center;
`;
