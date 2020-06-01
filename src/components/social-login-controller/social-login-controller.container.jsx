import React from "react";
import SocialLogin from "react-social-login";

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
