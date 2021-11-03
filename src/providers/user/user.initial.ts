import type { UserActionType } from "./types/user.actions";
import type { UserContextInterface } from "./types/user.context";
import type { UserStateInterface } from "./types/user.state";

const InitialState: UserStateInterface = {
  profile: {
    username: "",
    email: "",
    avatar: "",
  },
  login: false,
  transaction: false,
  error: null,
};

export default InitialState;

export const UserContextInitial: UserContextInterface = {
  socialLogin: InitialState,
  dispatch: (action: UserActionType) => null,
};
