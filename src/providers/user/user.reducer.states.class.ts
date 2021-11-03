import type { UserActionType } from "./types/user.actions";
import type { UserStateInterface } from "./types/user.state";
import InitialState from "./user.initial";

class SocialReducerStates {
  wrongTypeError = "Received wrong action type.";

  private getInitialState = () =>
    JSON.parse(JSON.stringify(InitialState)) as UserStateInterface;

  AuthExpired(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "AuthExpired") {
      return {
        ...state,
        transaction: false,
        error: action.type,
        profile: {
          ...state.profile,
        },
      };
    }
    throw new Error(this.wrongTypeError);
  }

  Reset(state: UserStateInterface, action: UserActionType): UserStateInterface {
    if (action.type === "Reset") {
      return this.getInitialState();
    }
    throw new Error(this.wrongTypeError);
  }

  FetchUserStart(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "FetchUserStart") {
      return {
        ...state,
        transaction: true,
        profile: {
          ...state.profile,
          username: action.username,
        },
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default SocialReducerStates;
