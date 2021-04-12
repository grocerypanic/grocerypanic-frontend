import styled from "styled-components";

import { graph, white, tertiary } from "../../configuration/theme";

export const Outline = styled.div`
  list-style-type: none;
  list-style-position: outside;
  margin: 0px;
  width: 100%;
  background: ${tertiary};
  padding: 10px;
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InnerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: row;

  background: ${white};
  margin: 5px;
  padding: 5px;

  .table {
    margin-bottom: 0px;
  }
  .chartBox {
    height: ${graph.chartContainerHeight};
    flex: 0 0 auto;
    width: 100%;
  }
`;
