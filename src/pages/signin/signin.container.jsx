import React from "react";
import SignIn from "./signin.page";

const SignInContainer = () => {
  const triggerLogin = (provider) => console.log(provider);

  return <SignIn triggerLogin={triggerLogin} />;
};

export default SignInContainer;
