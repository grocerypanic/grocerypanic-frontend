import { Paths, Providers } from "../../configuration/backend";
import match2xx from "../../util/requests/status";
import Request from "../../util/requests";
import { Constants } from "../../configuration/backend";
import UserActions from "./user.actions";

export const asyncLogin = async ({ state, action }) => {
  const { payload, dispatch } = action;
  let data;
  let path;

  switch (payload._provider) {
    case Providers.google:
      data = {
        access_token: payload._token.accessToken,
        code: payload._token.idToken,
      };
      path = Paths.googleLogin;
      break;
    case Providers.facebook:
      data = {
        access_token: payload._token.accessToken,
        code: payload._token.idToken,
      };
      path = Paths.facebookLogin;
      break;
    default:
      return loginError(dispatch);
  }

  const [response, status] = await Request("POST", path, data);

  if (
    status === 400 &&
    response.non_field_errors[0] === Constants.alreadyRegistered
  ) {
    return new Promise(function (resolve) {
      dispatch({
        type: UserActions.DuplicateAccount,
      });
    });
  }

  if (match2xx(status)) {
    return new Promise(function (resolve) {
      dispatch({
        type: UserActions.SuccessFetchUser,
        payload: {
          username: payload._profile.name,
          avatar: payload._profile.profilePicURL,
          email: payload._profile.email,
        },
      });
    });
  }

  return loginError(dispatch, payload._profile.name);
};

export const triggerLogin = async (dispatch, response) => {
  if (Object.keys(Providers).includes(response._provider)) {
    await dispatch({
      type: UserActions.StartFetchUser,
      payload: response,
      func: asyncLogin,
      dispatch: dispatch,
    });
  }
};

export const resetLogin = async (dispatch) => {
  dispatch({
    type: UserActions.ResetUser,
  });
};

export const loginError = async (dispatch, username = "") => {
  dispatch({
    type: UserActions.FailureFetchUser,
    payload: {
      username,
    },
  });
};

export const authExpired = async (dispatch) => {
  dispatch({
    type: UserActions.AuthExpired,
    payload: {
      username: "",
    },
  });
};
