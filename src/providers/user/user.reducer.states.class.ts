import InitialState from "./user.initial";
import type { UserActionType } from "./types/user.actions";
import type { UserStateInterface } from "./types/user.state";

class UserReducerStates {
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
        login: false,
        error: action.type,
        profile: {
          ...state.profile,
        },
        transaction: false,
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

  FetchUserFailure(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "FetchUserFailure") {
      return {
        ...state,
        error: action.type,
        login: false,
        profile: {
          ...state.profile,
        },
        transaction: false,
      };
    }
    throw new Error(this.wrongTypeError);
  }

  FetchUserReady(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "FetchUserReady") {
      return {
        ...state,
        error: null,
        login: true,
        profile: {
          ...state.profile,
        },
        transaction: false,
      };
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
        login: false,
        profile: {
          ...state.profile,
          username: action.username,
        },
        transaction: true,
      };
    }
    throw new Error(this.wrongTypeError);
  }

  FetchUserSuccess(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "FetchUserSuccess") {
      return {
        ...state,
        error: null,
        login: false,
        profile: {
          ...action.profile,
        },
        transaction: false,
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default UserReducerStates;
