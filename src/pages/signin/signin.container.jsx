import React from "react";

import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { UserContext } from "../../providers/user/user.provider";

import {
  triggerLogin,
  resetLogin,
  loginError,
} from "../../providers/user/user.async";

const SignInContainer = () => {
  const { event } = React.useContext(AnalyticsContext);
  const { user, dispatch } = React.useContext(UserContext);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

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
      {user.error ? (
        <ErrorDialogue
          eventError={AnalyticsActions.LoginError}
          clearError={clearLogin}
          messageTranslationKey={user.errorMessage}
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
