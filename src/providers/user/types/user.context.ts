import type { UserActionType } from "./user.actions";
import type { UserStateInterface } from "./user.state";
import type { Dispatch } from "react";

export interface UserContextInterface {
  socialLogin: UserStateInterface;
  dispatch: Dispatch<UserActionType>;
}
