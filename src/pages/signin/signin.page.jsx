import React from "react";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";

import SocialLoginController, {
  providers,
} from "../../components/social-login-controller/social-login-controller.container";
import Copyright from "../../components/copyright/copyright.component";
import { useTranslation } from "react-i18next";

import Strings from "../../configuration/strings";

import { Paper, Container } from "../../global-styles/containers";
import { LockBox, ButtonBox } from "./signin.styles";

const SignIn = ({ triggerLogin }) => {
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
            appId={process.env.GOOGLE_ACCOUNT_ID}
            provider={providers.google}
            message={t(Strings.LoginMessageGoogle)}
            triggerLogin={() => triggerLogin(providers.google)}
          />
        </ButtonBox>
        <ButtonBox>
          <SocialLoginController
            ButtonType={FacebookLoginButton}
            appId={process.env.FACEBOOK_ACCOUNT_ID}
            provider={providers.facebook}
            message={t(Strings.LoginMessageFacebook)}
            triggerLogin={() => triggerLogin(providers.facebook)}
          />
        </ButtonBox>
        <Copyright />
      </Paper>
    </Container>
  );
};

export default SignIn;
