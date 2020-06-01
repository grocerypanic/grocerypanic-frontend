import React from "react";
import { useTranslation } from "react-i18next";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import { Paper, Container } from "../../global-styles/containers";
import { NotePad, Page, OK, ErrorBox } from "./error-dialogue.styles";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import Strings from "../../configuration/strings";

const ErrorDialogue = ({
  clearError,
  eventMessage,
  message,
  redirect,
  history,
}) => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);

  const handleClick = () => {
    clearError();
  };

  React.useEffect(() => {
    event(eventMessage);
  }, []);

  return (
    <Container>
      <Paper>
        <ErrorBox>
          <WarningOutlinedIcon />
        </ErrorBox>
        <h1>{t(Strings.ErrorDialogueTitle)}</h1>
        <NotePad>
          <Page className="alert alert-danger">{t(Strings[message])}</Page>
        </NotePad>
        <OK
          data-testid="ErrorConfirmation"
          onClick={handleClick}
          className="btn btn-success"
        >
          {t(Strings.ErrorDialogueConfirm)}
        </OK>
      </Paper>
    </Container>
  );
};

export default ErrorDialogue;
