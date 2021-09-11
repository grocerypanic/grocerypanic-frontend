import { useContext, useState, useEffect } from "react";
import SocialActions from "./social.actions";
import * as asyncFn from "./social.async";
import { SocialContext } from "./social.provider";
import { Providers } from "../../configuration/backend";

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
