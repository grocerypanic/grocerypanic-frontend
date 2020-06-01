import { Paths, Providers } from "../../configuration/backend";
import { Post } from "../../util/requests";
import UserActions from "./user.actions";

export const asyncLogin = async ({ state, action }) => {
  const { payload, dispatch } = action;
  if (Object.keys(Providers).includes(payload._provider)) {
    const data = {
      access_token: payload._token.accessToken,
      code: payload._token.idToken,
    };
    const [, status] = await Post(Paths.googleLogin, data);
    if (status === 200) {
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
    return dispatch({
      type: UserActions.FailureFetchUser,
      payload: {
        username: payload.username,
      },
    });
  }
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
