import SocialActions from "./social.actions";
import { Paths, Providers } from "../../configuration/backend";
import { Constants } from "../../configuration/backend";
import Request from "../../util/requests";
import { match2xx } from "../../util/requests/status";

export const asyncLogin = async ({ state, action }) => {
  const { payload, dispatch } = action;
  let data;
  let path;

  const extractData = () => ({
    access_token: payload._token.accessToken,
    code: payload._token.idToken,
  });

  switch (payload._provider) {
    case Providers.google:
      data = extractData();
      path = Paths.googleLogin;
      break;
    case Providers.facebook:
      data = extractData();
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
        type: SocialActions.DuplicateAccount,
      });
    });
  }

  if (match2xx(status)) {
    if (payload._provider === Providers.google) {
      payload._profile = {
        name: response.user.username,
        email: response.user.email,
      };
    }

    return new Promise(function (resolve) {
      dispatch({
        type: SocialActions.SuccessFetchUser,
        payload: {
          username: payload._profile.name,
          avatar: payload._profile.profilePicURL,
          email: payload._profile.email,
        },
      });
    });
  }

  return loginError(dispatch, payload._profile?.name);
};

export const resetLogin = async (dispatch) => {
  dispatch({
    type: SocialActions.ResetUser,
  });
};

export const loginError = async (dispatch, username = "") => {
  dispatch({
    type: SocialActions.FailureFetchUser,
    payload: {
      username,
    },
  });
};

export const authExpired = async (dispatch) => {
  dispatch({
    type: SocialActions.AuthExpired,
    payload: {
      username: "",
    },
  });
};
