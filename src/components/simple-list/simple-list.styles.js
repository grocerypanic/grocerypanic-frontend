import styled from "styled-components";

import { primary, secondary, tertiary } from "../../configuration/theme";

export const ListBox = styled.ul`
  list-style-type: none;
  list-style-position: outside;
  padding-left: 0px;
  margin: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 10px;
`;

export const Banner = styled.div`
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
`;

export const PlaceHolderListItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${secondary};
  margin: 5px;
  padding: 5px;
  color: ${primary};

  min-width: 220px;
  cursor: pointer;
`;
