import styled from "styled-components";
import { Link } from "react-router-dom";

import { primary, black } from "../../configuration/theme";

export const CopyrightBox = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  color: ${black};
`;

export const StyledLink = styled(Link)`
  cursor: pointer;
  color: ${primary};
  text-decoration: none;
`;
