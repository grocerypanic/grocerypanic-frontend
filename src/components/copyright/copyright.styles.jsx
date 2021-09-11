import styled from "styled-components";
import { primary, black } from "../../configuration/theme";

export const CopyrightBox = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  color: ${black};
`;

export const StyledLink = styled.a`
  cursor: pointer;
  color: ${primary};
  text-decoration: none;
`;
