import styled, { css } from "styled-components";
import { Navbar } from "react-bootstrap";
import { primary } from "../../configuration/theme";

import { secondary } from "../../configuration/theme";

const container = css`
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavContainer = styled(Navbar)`
  background-color: ${primary};
  height: 50px;
  padding: 2px;
  padding-left: 10px;
`;

export const OffIconContainer = styled.div`
  ${container}
  color: ${primary};
  background-color: ${primary};
`;

export const IconContainer = styled.div`
  ${container}
  background-color: ${primary};
`;

export const MenuContainer = styled.div`
  ${(props) =>
    props.route === props.history.location.pathname
      ? `color: ${secondary};`
      : null};
`;
