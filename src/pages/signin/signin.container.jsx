import React from "react";

import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";

import { UserContext } from "../../providers/user/user.provider";
import {
  triggerLogin,
  resetLogin,
  loginError,
} from "../../providers/user/user.async";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Routes from "../../configuration/routes";
import Strings from "../../configuration/strings";

const SignInContainer = () => {
  const { user, dispatch } = React.useContext(UserContext);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  React.useEffect(() => {
    if (!performAsync) return;
    dispatch(performAsync);
    setPerformAsync(null);
  }, [performAsync]);

  const handleSocialLogin = (response) => {
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
          stringsRoot={Strings.SignIn}
          string={user.errorMessage}
          redirect={Routes.root}
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
