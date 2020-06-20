import styled from "styled-components";
import { navbarSize, tabSize } from "../configuration/theme";

export const Container = styled.div`
  ${(props) =>
    props.tabs
      ? `margin-top: ${navbarSize}`
      : `margin-top: calc(${navbarSize} + ${tabSize})`};

  display: flex;
  flex-direction: column;
  align-items: center;

  .nav-tabs {
    height: 28px !important;
    font-size: 0.75em;
  }
  a[role="tab"] {
    padding-bottom: 0px;
    padding-top: 4px;
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export const Paper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: #000000;
`;
