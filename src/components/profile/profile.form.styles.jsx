import styled from "styled-components";

import { white, tertiary } from "../../configuration/theme";

export const Outline = styled.div`
  list-style-type: none;
  list-style-position: outside;
  padding-left: 0px;
  margin: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 10px;
`;

export const FormBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;

  background: ${white};
  margin: 5px;
  padding: 5px;

  min-width: 220px;
  max-width: 350px;

  .form-group {
    margin-bottom: 2px;
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .btn {
    margin-top: 20px;
  }
`;
