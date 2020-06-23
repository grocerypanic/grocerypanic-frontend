import styled from "styled-components";

import { primary, white, tertiary } from "../../configuration/theme";

export const Outline = styled.div`
  list-style-type: none;
  list-style-position: outside;
  margin: 0px;
  width: 100%;
  background: ${tertiary};
  padding: 10px;
`;

export const Banner = styled.div`
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
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
`;

export const Title = styled.div`
  text-align: center;
`;
