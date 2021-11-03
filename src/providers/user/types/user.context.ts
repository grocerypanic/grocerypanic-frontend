import type { Dispatch } from "react";
import type { UserActionType } from "./user.actions";
import type { UserStateInterface } from "./user.state";

export interface UserContextInterface {
  socialLogin: UserStateInterface;
  dispatch: Dispatch<UserActionType>;
}
