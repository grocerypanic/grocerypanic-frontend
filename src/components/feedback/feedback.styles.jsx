import styled from "styled-components";

import { primary, tertiary } from "../../configuration/theme";

export const TextBox = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.7em;
  color: ${tertiary};
`;

export const StyledLink = styled.a`
  cursor: pointer;
  color: ${primary};
  text-decoration: none;
`;
