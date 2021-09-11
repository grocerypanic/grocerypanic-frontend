import styled from "styled-components";
import { tertiary, itemAttributes } from "../../configuration/theme";

export const Scroller = styled.div`
  align-items: center;
  list-style-type: none;
  list-style-position: outside;
  overflow: scroll;
  max-height: ${(props) => `${props.size}`}px;
  border-style: solid;
  border-color: ${tertiary};
  border-width: ${itemAttributes.border}px;
`;

export const ListBox = styled.div`
  padding-left: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 0px;

  li:last-child {
    margin-bottom: 0px;
  }
`;
