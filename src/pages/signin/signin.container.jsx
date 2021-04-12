import React from "react";

import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { SocialContext } from "../../providers/social/social.provider";
import { HeaderContext } from "../../providers/header/header.provider";

import {
  triggerLogin,
  resetLogin,
  loginError,
} from "../../providers/social/social.async";

const SignInContainer = () => {
  const { event } = React.useContext(AnalyticsContext);
  const { socialLogin, dispatch } = React.useContext(SocialContext);
  const { updateHeader } = React.useContext(HeaderContext);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  React.useEffect(() => {
    updateHeader({
      title: "MainHeaderTitle",
      disableNav: true,
    });
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (!performAsync) return;
    dispatch(performAsync);
    setPerformAsync(null);
  }, [performAsync]); // eslint-disable-line

  const handleSocialLogin = (response) => {
    event(AnalyticsActions.LoginSuccess);
    triggerLogin(setPerformAsync, response);
  };

  const handleSocialLoginError = () => {
    loginError(setPerformAsync);
  };

  const clearLogin = () => {
    resetLogin(setPerformAsync);
  };

  return (
    <div>
      {socialLogin.error ? (
        <ErrorDialogue
          eventError={AnalyticsActions.LoginError}
          clearError={clearLogin}
          messageTranslationKey={socialLogin.errorMessage}
        />
      ) : (
        <SignIn
          handleSocialLogin={handleSocialLogin}
          handleSocialLoginError={handleSocialLoginError}
        />
      )}
    </div>
  );
};

export default SignInContainer;
