import React from "react";

import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";

import { UserContext } from "../../providers/user/user.provider";
import { triggerLogin, resetLogin } from "../../providers/user/user.async";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Routes from "../../configuration/routes";

const SignInContainer = () => {
  const { user, dispatch } = React.useContext(UserContext);

  const handleSocialLogin = (response) => {
    triggerLogin(dispatch, response);
  };

  const handleSocialLoginError = (response) => {
    resetLogin(dispatch);
  };

  return (
    <div>
      {user.error ? (
        <ErrorDialogue
          eventError={AnalyticsActions.LoginError}
          clearError={handleSocialLoginError}
          message={user.errorMessage}
          redirect={Routes.root}
        />
      ) : (
        <SignIn handleSocialLogin={handleSocialLogin} />
      )}
    </div>
  );
};

export default SignInContainer;
