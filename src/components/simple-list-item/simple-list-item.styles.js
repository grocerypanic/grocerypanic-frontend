import styled from "styled-components";

import { secondary } from "../../configuration/theme";

export const ListItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: row;

  background: ${secondary};
  margin: 5px;
  padding: 5px;
  color: ${(props) => (props.selected === props.item.id ? "red" : "blue")};

  min-width: 220px;
  cursor: pointer;

  div:last-child {
    margin-left: auto;
  }
`;

export const ListTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;

  height: 40px;
  cursor: pointer;
`;
