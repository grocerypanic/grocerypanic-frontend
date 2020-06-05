import React from "react";
import { useTranslation } from "react-i18next";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import PropTypes from "prop-types";

import { Paper, Container } from "../../global-styles/containers";
import { NotePad, Page, OK, ErrorBox, Centered } from "./error-dialogue.styles";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import Strings from "../../configuration/strings";

const ErrorDialogue = ({ clearError, eventMessage, message, redirect }) => {
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
          <Page className="alert alert-danger">
            {t(Strings[message])
              .split("\n")
              .map((item, index) => {
                return <Centered key={index}>{item}</Centered>;
              })}
          </Page>
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

ErrorDialogue.propTypes = {
  clearError: PropTypes.func.isRequired,
  eventMessage: PropTypes.object,
  message: PropTypes.string.isRequired,
  redirect: PropTypes.string.isRequired,
};
