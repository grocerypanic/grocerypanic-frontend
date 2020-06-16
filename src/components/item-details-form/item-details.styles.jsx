import styled from "styled-components";

import { primary, white, tertiary } from "../../configuration/theme";

export const Outline = styled.div`
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

export const FormBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;

  background: ${white};
  margin: 5px;
  padding: 10px;
  padding-top: 20px;

  min-width: 220px;
  max-width: 350px;
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
