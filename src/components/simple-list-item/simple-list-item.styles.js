import styled from "styled-components";

import { white, highlight, selected } from "../../configuration/theme";

export const ListItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: row;

  background: ${white};
  margin: 5px;
  padding: 5px;
  color: ${highlight};

  min-width: 220px;

  div:last-child {
    margin-left: auto;
  }

  .simple-list-item-title-div:hover {
    color: ${selected};
    cursor: pointer;
  }
`;

export const ListTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;

  height: 40px;
`;
