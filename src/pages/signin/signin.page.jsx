import LockOpenIcon from "@material-ui/icons/LockOpen";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";
import { LockBox, ButtonBox } from "./signin.styles";
import Copyright from "../../components/copyright/copyright.component";
import SocialLoginControllerGoogle from "../../components/social-login-controller-google/social-login-controller-google.container";
import SocialLoginController from "../../components/social-login-controller/social-login-controller.container";
import { Providers } from "../../configuration/backend";
import { Paper, Container } from "../../global-styles/containers";

const SignIn = ({ handleSocialLogin, handleSocialLoginError }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Paper>
        <LockBox>
          <LockOpenIcon />
        </LockBox>
        <h1>{t("SignIn.Title")}</h1>
        <ButtonBox>
          <SocialLoginControllerGoogle
            ButtonType={GoogleLoginButton}
            fallbackMessage={t("SignIn.PendingSocialConnection")}
            message={t("SignIn.LoginMessageGoogle")}
            onLoginSuccess={handleSocialLogin}
            onLoginFailure={handleSocialLoginError}
          />
        </ButtonBox>
        <ButtonBox>
          <SocialLoginController
            ButtonType={FacebookLoginButton}
            appId={process.env.REACT_APP_FACEBOOK_ACCOUNT_ID}
            fallbackMessage={t("SignIn.PendingSocialConnection")}
            message={t("SignIn.LoginMessageFacebook")}
            onLoginSuccess={handleSocialLogin}
            onLoginFailure={handleSocialLoginError}
            provider={Providers.facebook}
          />
        </ButtonBox>
        <Copyright />
      </Paper>
    </Container>
  );
};

export default SignIn;
