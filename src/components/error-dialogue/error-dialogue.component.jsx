import React from "react";

import { Paper, Container } from "../../global-styles/containers";
import { NotePad, Page } from "./error-dialogue.styles";

const ErrorDialogue = ({ message }) => {
  return (
    <Container>
      <Paper>
        <NotePad>
          <Page>{message}</Page>
        </NotePad>
      </Paper>
    </Container>
  );
};

export default ErrorDialogue;
