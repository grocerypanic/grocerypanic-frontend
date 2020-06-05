import React from "react";
import SocialLogin from "react-social-login";
import PropTypes from "prop-types";

class SocialLoginController extends React.Component {
  render() {
    const { ButtonType, message, triggerLogin } = this.props;

    return (
      <div data-testid="SocialController">
        <ButtonType onClick={triggerLogin}>{message}</ButtonType>
      </div>
    );
  }
}

export default SocialLogin(SocialLoginController);

SocialLoginController.propTypes = {
  ButtonType: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  triggerLogin: PropTypes.func.isRequired,
};
