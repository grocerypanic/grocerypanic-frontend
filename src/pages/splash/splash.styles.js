import styled from "styled-components";

import { navbarSize } from "../../configuration/theme";

export const SplashBox = styled.div`
  height: calc(100vh - ${navbarSize});
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0px 0px 3px rgba(0, 0, 0, 1);
  width: 100vw;
  overflow: hidden;

  .img1 {
    object-fit: cover;
    ${(props) => (props.mobile ? "object-position: -350px -100px;" : null)}
    filter: brightness(25%);
  }

  .img2 {
    object-fit: cover;
    ${(props) => (props.mobile ? "object-position: -350px -250px;" : null)}
    filter: brightness(25%);
  }
`;

export const Paragraphs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: ${(props) => (props.mobile ? 1 : 1.5)}em;
`;
