import React from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import PropTypes from "prop-types";

import { Paper, Container } from "../../global-styles/containers";
import { NotePad, Page, OK, ErrorBox, Centered } from "./error-dialogue.styles";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { HeaderContext } from "../../providers/header/header.provider";

import Routes from "../../configuration/routes";
import Strings from "../../configuration/strings";

const ErrorDialogue = ({
  clearError,
  eventMessage,
  stringsRoot,
  string,
  redirect,
  history,
}) => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);

  const handleClick = () => {
    clearError();
    if (redirect === Routes.goBack) return history.goBack();
    if (!redirect) return;
    history.push(redirect);
  };

  React.useEffect(() => {
    updateHeader({
      title: Strings.ErrorDialogue.headerTitle,
      create: null,
      transaction: false,
      disableNav: true,
    });
    if (eventMessage) event(eventMessage);
  }, []);

  return (
    <Container>
      <Paper>
        <ErrorBox>
          <WarningOutlinedIcon />
        </ErrorBox>
        <h1>{t(Strings.ErrorDialogue.ErrorDialogueTitle)}</h1>
        <NotePad>
          <Page className="alert alert-danger">
            {t(stringsRoot[string])
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
          {t(Strings.ErrorDialogue.ErrorDialogueConfirm)}
        </OK>
      </Paper>
    </Container>
  );
};

export default withRouter(ErrorDialogue);

ErrorDialogue.propTypes = {
  clearError: PropTypes.func.isRequired,
  eventMessage: PropTypes.object,
  stringsRoot: PropTypes.object.isRequired,
  string: PropTypes.string.isRequired,
  redirect: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }),
};
