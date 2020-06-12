import styled from "styled-components";

import {
  highlight,
  primary,
  secondary,
  selected,
  danger,
  success,
} from "../../configuration/theme";

const digitWidth = "20px";
const titleWidth = "120px";
const buttonWidth = "45px";

export const Row = styled.li`
  display: grid;
  grid-auto-flow: column;
  grid-template: ${digitWidth}, ${digitWidth}, ${titleWidth}, ${buttonWidth},
    ${buttonWidth};
  grid-gap: 4px;

  background: ${secondary};
  margin: 3px;
  padding: 2px;
  color: ${primary};
`;

export const Digit = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  width: ${digitWidth};
  height: 40px;
  cursor: pointer;
  ${(props) => (props.type === "expired" ? `color: ${danger};` : null)}
`;

export const Control = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  height: 40px;
  cursor: pointer;
  width: ${buttonWidth};

  .btn-sm {
    padding: 0px;
    margin: 2px;
  }

  .dropdown-menu {
    ${(props) => (props.type === "consume" ? `background: ${danger};` : null)};
    ${(props) => (props.type === "restock" ? `background: ${success};` : null)};
  }
`;

export const Symbol = styled.span`
  .svg_icons {
    transform: scale(0.9);
  }
`;

export const ListTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  color: ${highlight};
  width: ${titleWidth};

  height: 40px;
  cursor: pointer;
  *:hover {
    color: ${selected};
  }
`;
