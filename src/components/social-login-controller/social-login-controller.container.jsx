import React from "react";
import SocialLogin from "react-social-login";

class SocialLoginController extends React.Component {
  render() {
    const { ButtonType, message, triggerLogin } = this.props;

    return <ButtonType onClick={triggerLogin}>{message}</ButtonType>;
  }
}

export default SocialLogin(SocialLoginController);
