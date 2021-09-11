import styled from "styled-components";
import {
  primary,
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

export const ListBox = styled.div`
  padding-left: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 0px;

  li:last-child {
    margin-bottom: 0px;
  }
`;

export const PlaceHolderListItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  min-height: ${itemAttributes.innerHeight}px;

  background: ${white};
  padding: ${itemAttributes.placeHolderPadding}px;

  min-width: 220px;

  color: ${primary};
  margin-bottom: 0px;
`;
