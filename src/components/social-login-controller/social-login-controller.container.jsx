import PropTypes from "prop-types";
import React from "react";
import SocialLogin from "react-social-login";
import SocialLoginButton from "./social-login-button/social-login-button";
import StandBy from "../social-login-standby/social-login-standby.component";

class SocialLoginController extends SocialLogin(SocialLoginButton) {
  render() {
    const result = super.render();
    if (result) return result;

    return (
      <div data-testid="PendingSocialController">
        <StandBy>{this.props.fallbackMessage}</StandBy>
      </div>
    );
  }
}

export default SocialLoginController;

SocialLoginController.propTypes = {
  ButtonType: PropTypes.func.isRequired,
  fallbackMessage: PropTypes.string.isRequired,
  onLoginFailure: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
