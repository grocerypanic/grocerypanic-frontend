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
      profile: {
        username: string;
        email: string;
        avatar: string;
      };
    }
  | { type: "Reset" };
