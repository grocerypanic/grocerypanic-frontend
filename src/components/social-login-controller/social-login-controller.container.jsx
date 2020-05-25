import React from "react";
import SocialLogin from "react-social-login";

export const providers = {
  google: "google",
  facebook: "facebook",
};

class SocialLoginController extends React.Component {
  handleSocialLogin = (user) => {
    console.log(user);
  };
  handleSocialLoginFailure = (err) => {
    console.error(err);
  };

  render() {
    const { ButtonType, message, triggerLogin } = this.props;
    return <ButtonType onClick={triggerLogin}>{message}</ButtonType>;
  }
}

export default SocialLogin(SocialLoginController);
