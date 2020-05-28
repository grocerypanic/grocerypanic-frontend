import { Paths, Providers } from "../../configuration/backend";
import { Post } from "../../util/requests";
import UserActions from "./user.actions";

export const login = async (state, action, dispatch) => {

    const {user} = action

    if (Object.keys(Providers).includes(user._provider)) {
      const data = {
        access_token: user._token.accessToken,
        code: user._token.idToken,
      };
      const [result, status] = await Post(Paths.googleLogin, data);
      if (status === 200) {
        dispatch(
          state,
          {type: UserActions.SuccessFetchUser},
          dispatch
        )
        console.log("Redirect");
        return;
      }
      console.log("Login Error");
    }
  };
}