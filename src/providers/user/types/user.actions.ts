export type UserActionType =
  | {
      type: "AuthExpired";
    }
  | {
      type: "FetchUserFailure";
    }
  | {
      type: "FetchUserReady";
    }
  | {
      type: "FetchUserStart";
      username: string;
    }
  | {
      type: "FetchUserSuccess";
    }
  | { type: "Reset" };
