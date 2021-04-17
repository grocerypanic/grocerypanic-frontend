import { useContext, useState, useEffect } from "react";
import { SocialContext } from "./social.provider";
import SocialActions from "./social.actions";
import { Providers } from "../../configuration/backend";
import * as asyncFn from "./social.async";

const useSocialLogin = () => {
  const { socialLogin, dispatch } = useContext(SocialContext);
  const [command, runCommand] = useState(null);

  useEffect(() => {
    if (!command) return;
    dispatch(command);
    runCommand(null);
  }, [command]); // eslint-disable-line

  const reset = () => dispatch({ type: SocialActions.ResetUser });

  const login = (response) => {
    if (Object.keys(Providers).includes(response._provider)) {
      runCommand({
        type: SocialActions.StartFetchUser,
        payload: response,
        func: asyncFn.asyncLogin,
        dispatch: runCommand,
      });
    }
  };

  const error = (username = "") =>
    runCommand({
      type: SocialActions.FailureFetchUser,
      payload: {
        username,
      },
    });

  const expiredAuth = () =>
    runCommand({ type: SocialActions.AuthExpired, payload: { username: "" } });

  return {
    social: {
      socialLogin,
      error,
      expiredAuth,
      login,
      reset,
    },
  };
};

export default useSocialLogin;
