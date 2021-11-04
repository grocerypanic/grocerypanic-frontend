import ErrorState from "./fixtures/user.state.error";
import TransactionState from "./fixtures/user.state.transaction";
import InitialState from "../user.initial";
import UserReducerStates from "../user.reducer.states.class";
import type { UserActionType } from "../types/user.actions";
import type { UserStateInterface } from "../types/user.state";

describe("UserReducerStates", () => {
  let reducerStates: UserReducerStates;
  let received: UserStateInterface;
  const testUser = "test-user";
  const testEmail = "test@testEmail.com";
  const testAvatar = "http://image.com";

  beforeEach(() => {
    reducerStates = new UserReducerStates();
  });

  const getState = (source: UserStateInterface) =>
    JSON.parse(JSON.stringify(source)) as UserStateInterface;

  const arrange = (action: UserActionType, state: UserStateInterface) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: UserActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...getState(InitialState) }, {
        type: "InvalidAction",
      } as never as UserActionType);
  };

  describe("AuthExpired", () => {
    const testType = "AuthExpired" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "AuthExpired",
        },
        getState(ErrorState)
      );
      const expectedState: UserStateInterface = {
        error: testType,
        login: false,
        profile: getState(ErrorState).profile,
        transaction: false,
      };
      expect(received).toStrictEqual(expectedState);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("FetchUserFailure", () => {
    const testType = "FetchUserFailure" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "FetchUserFailure",
        },
        getState(TransactionState)
      );
      const expectedState: UserStateInterface = {
        error: testType,
        login: false,
        profile: {
          ...getState(TransactionState).profile,
        },
        transaction: false,
      };
      expect(received).toStrictEqual(expectedState);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("FetchUserReady", () => {
    const testType = "FetchUserReady" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "FetchUserReady",
        },
        getState(TransactionState)
      );
      const expectedState: UserStateInterface = {
        error: null,
        login: true,
        profile: {
          ...getState(TransactionState).profile,
        },
        transaction: false,
      };
      expect(received).toStrictEqual(expectedState);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("FetchUserStart", () => {
    const testType = "FetchUserStart" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "FetchUserStart",
          username: testUser,
        },
        getState(InitialState)
      );
      const expectedState: UserStateInterface = {
        error: null,
        login: false,
        profile: {
          username: testUser,
          email: "",
          avatar: "",
        },
        transaction: true,
      };
      expect(received).toStrictEqual(expectedState);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("FetchUserSuccess", () => {
    const testType = "FetchUserSuccess" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "FetchUserSuccess",
          profile: {
            username: testUser,
            email: testEmail,
            avatar: testAvatar,
          },
        },
        getState(TransactionState)
      );
      const expectedState: UserStateInterface = {
        error: null,
        login: false,
        profile: {
          username: testUser,
          email: testEmail,
          avatar: testAvatar,
        },
        transaction: false,
      };
      expect(received).toStrictEqual(expectedState);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("Reset", () => {
    const testType = "Reset" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "Reset",
        },
        getState(ErrorState)
      );
      expect(received).toStrictEqual(getState(InitialState));
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });
});
