import React from "react";

import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";

import { UserContext } from "../../providers/user/user.provider";
import { triggerLogin } from "../../providers/user/user.async";

const SignInContainer = () => {
  const { user, dispatch } = React.useContext(UserContext);

  const handleSocialLogin = (response) => {
    triggerLogin(dispatch, response);
  };

  const handleSocialLoginFailure = (err) => {
    console.error(err);
  };

  return (
    <div>
      {user.error ? (
        <ErrorDialogue message={"hi"} />
      ) : (
        <SignIn
          handleSocialLogin={handleSocialLogin}
          handleSocialLoginFailure={handleSocialLoginFailure}
        />
      )}
    </div>
  );
};

export default SignInContainer;
