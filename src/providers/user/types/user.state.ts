import type { UserActionType } from "./user.actions";

export interface UserStateInterface {
  error: null | UserActionType["type"];
  login: boolean;
  profile: {
    username: string;
    email: string;
    avatar: string;
  };
  transaction: boolean;
}
