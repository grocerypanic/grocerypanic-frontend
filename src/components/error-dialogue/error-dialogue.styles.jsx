import styled from "styled-components";

import { secondary, tertiary } from "../../configuration/theme";

export const NotePad = styled.ul`
  padding-left: 0px;
  margin: 0px;
  min-width: 200px;
  background: ${tertiary};
  padding: 10px;
`;

export const Page = styled.div`
  margin: 0px;
  min-width: 200px;
  background: ${secondary};
  padding: 10px;
`;
