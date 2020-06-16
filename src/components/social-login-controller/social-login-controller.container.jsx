import React from "react";
import SocialLogin from "react-social-login";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

import StandBy from "./social-login-controller.standby";

import Strings from "../../configuration/strings";

class SocialLoginController extends React.Component {
  render() {
    const { t } = this.props;
    const { ButtonType, message, triggerLogin } = this.props;

    if (!window.gapi && !window.FB)
      return (
        <div data-testid="PendingSocialController">
          <StandBy>{t(Strings.SignIn.PendingSocialConnection)}</StandBy>
        </div>
      );

    return (
      <div data-testid="SocialController">
        <ButtonType onClick={triggerLogin}>{message}</ButtonType>
      </div>
    );
  }
}

export default withTranslation()(SocialLogin(SocialLoginController));

SocialLoginController.propTypes = {
  ButtonType: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  triggerLogin: PropTypes.func.isRequired,
};
