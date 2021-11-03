import type { UserActionType } from "../types/user.actions";
import type { UserStateInterface } from "../types/user.state";
import InitialState from "../user.initial";
import ErrorState from "./fixtures/user.state.error.ts";
import UserReducerStates from "../user.reducer.states.class";

describe("UserReducerStates", () => {
  let reducerStates: UserReducerStates;
  let received: UserStateInterface;
  const testUser = "test-user";

  beforeEach(() => {
    reducerStates = new UserReducerStates();
  });

  const getInitialState = () =>
    JSON.parse(JSON.stringify(InitialState)) as UserStateInterface;

  const getErrorState = () =>
    JSON.parse(JSON.stringify(ErrorState)) as UserStateInterface;

  const arrange = (action: UserActionType, state: UserStateInterface) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: UserActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...getInitialState() }, {
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
        getErrorState()
      );
      const expectedState: UserStateInterface = {
        error: testType,
        login: false,
        profile: getErrorState().profile,
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
        getInitialState()
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

  describe("Reset", () => {
    const testType = "Reset" as const;

    it("should return the the expected state", () => {
      received = arrange(
        {
          type: "Reset",
        },
        getErrorState()
      );
      expect(received).toStrictEqual(getInitialState());
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });
});
