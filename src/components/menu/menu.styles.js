import styled from "styled-components";

import { selected, tertiary } from "../../configuration/theme";

export const ListBox = styled.ul`
  list-style-type: none;
  list-style-position: outside;
  padding-left: 0px;
  margin: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 10px;

  li:hover {
    color: ${selected};
  }
`;

export const Banner = styled.div`
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
`;
