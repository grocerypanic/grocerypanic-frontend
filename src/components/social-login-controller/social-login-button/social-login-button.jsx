import PropTypes from "prop-types";
import React from "react";

class SocialLoginButton extends React.Component {
  render() {
    const { ButtonType, message, triggerLogin } = this.props;

    return (
      <div data-testid="SocialLoginButton">
        <ButtonType onClick={triggerLogin}>{message}</ButtonType>
      </div>
    );
  }
}
export default SocialLoginButton;

SocialLoginButton.propTypes = {
  ButtonType: PropTypes.func.isRequired,
  fallbackMessage: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  triggerLogin: PropTypes.func.isRequired,
};
