import styled from "styled-components";

import {
  black,
  white,
  tertiary,
  itemAttributes,
} from "../../configuration/theme";

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

export const ContentBorder = styled.div`
  padding-left: 0px;
  max-width: 250px;
  background: ${tertiary};
  padding-top: 0px;
`;

export const Content = styled.li`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;

  background: ${white};
  margin-bottom: ${itemAttributes.spacing}px;
  padding: ${itemAttributes.padding}px;
  color: ${black};
  font-size: 15px;

  min-width: 220px;

  span {
    margin-bottom: 10px;
  }

  span:last-child {
    margin-bottom: 0px;
  }
`;
