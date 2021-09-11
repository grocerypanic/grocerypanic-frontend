import { Navbar } from "react-bootstrap";
import styled, { css } from "styled-components";
import { primary } from "../../configuration/theme";
import { white, navbarSize } from "../../configuration/theme";

const container = css`
  height: ${navbarSize};
  width: ${navbarSize};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavContainer = styled(Navbar)`
  background-color: ${primary};
  height: ${navbarSize};
  padding: 2px;
  padding-left: 10px;

  .action {
    cursor: pointer;
  }
  .fit {
    padding-left: 3px !important;
    padding-right: 3px !important;
  }
  .header-hidden {
    display: none;
  }
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
      ? `color: ${white};`
      : null};
`;
