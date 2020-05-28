import React from "react";

import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";

import { UserContext } from "../../providers/user/user.provider";

import { Paths, Providers } from "../../configuration/backend";
import { Post } from "../../util/requests";

const SignInContainer = () => {
  const { user, dispatch } = React.useContext(UserContext);

  const handleSocialLogin = async (user) => {
    if (Object.keys(Providers).includes(user._provider)) {
      const data = {
        access_token: user._token.accessToken,
        code: user._token.idToken,
      };
      const [result, status] = await Post(Paths.googleLogin, data);
      if (status === 200) {
        console.log("Redirect");
        return;
      }
      console.log("Login Error");
    }
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
