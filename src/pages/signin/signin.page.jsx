import React from "react";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";

import SocialLoginController from "../../components/social-login-controller/social-login-controller.container";
import Copyright from "../../components/copyright/copyright.component";
import { useTranslation } from "react-i18next";

import Strings from "../../configuration/strings";
import { Providers } from "../../configuration/backend";

import { Paper, Container } from "../../global-styles/containers";
import { LockBox, ButtonBox } from "./signin.styles";

const SignIn = ({ handleSocialLogin, handleSocialLoginError }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Paper>
        <LockBox>
          <LockOutlinedIcon />
        </LockBox>
        <h1>{t(Strings.SignInMessage)}</h1>
        <ButtonBox>
          <SocialLoginController
            ButtonType={GoogleLoginButton}
            appId={process.env.REACT_APP_GOOGLE_ACCOUNT_ID}
            provider={Providers.google}
            message={t(Strings.LoginMessageGoogle)}
            onLoginSuccess={handleSocialLogin}
            onLoginFailure={handleSocialLoginError}
          />
        </ButtonBox>
        <ButtonBox>
          <SocialLoginController
            ButtonType={FacebookLoginButton}
            appId={process.env.REACT_APP_FACEBOOK_ACCOUNT_ID}
            provider={Providers.facebook}
            message={t(Strings.LoginMessageFacebook)}
            onLoginSuccess={handleSocialLogin}
            onLoginFailure={handleSocialLoginError}
          />
        </ButtonBox>
        <Copyright />
      </Paper>
    </Container>
  );
};

export default SignIn;
