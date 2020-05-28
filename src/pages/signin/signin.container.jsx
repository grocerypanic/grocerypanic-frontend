import React from "react";
import SignIn from "./signin.page";

import { Paths, Providers } from "../../configuration/backend";
import { Post } from "../../util/requests";

export const handleSocialLogin = async (user) => {
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

export const handleSocialLoginFailure = (err) => {
  console.error(err);
};

const SignInContainer = () => {
  return (
    <SignIn
      handleSocialLogin={handleSocialLogin}
      handleSocialLoginFailure={handleSocialLoginFailure}
    />
  );
};

export default SignInContainer;
