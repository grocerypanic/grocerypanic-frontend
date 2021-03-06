import styled from "styled-components";
import {
  highlight,
  primary,
  white,
  selected,
  danger,
  success,
  itemAttributes,
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

  background: ${white};
  margin-bottom: ${itemAttributes.spacing}px;
  padding: ${itemAttributes.padding}px;
  color: ${primary};
`;

export const Digit = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  width: ${digitWidth};
  height: ${itemAttributes.innerHeight}px;
  cursor: pointer;
`;

export const Control = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  height: ${itemAttributes.innerHeight}px;
  cursor: pointer;
  width: ${buttonWidth};

  .btn-sm {
    padding: 0px;
    margin: 2px;
  }

  .dropdown {
    position: inherit;
  }

  .dropdown-menu {
    ${(props) => (props.type === "consume" ? `background: ${danger};` : null)};
    ${(props) => (props.type === "restock" ? `background: ${success};` : null)};
    position: static;
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

  height: ${itemAttributes.innerHeight}px;
  span:hover {
    color: ${selected};
    cursor: pointer;
  }
`;
