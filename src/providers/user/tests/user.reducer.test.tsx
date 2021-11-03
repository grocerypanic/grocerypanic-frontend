import type { UserActionType } from "../types/user.actions";
import type { UserStateInterface } from "../types/user.state";
import InitialState from "../user.initial";
import UserReducer from "../user.reducer";

jest.mock("../user.reducer.states.class", () => {
  return jest.fn().mockImplementation(() => {
    return mockStates;
  });
});

const mockReturnValue = "MockReturnedState";
const mockStates = {
  AuthExpired: jest.fn().mockReturnValue(mockReturnValue),
  FetchUserFailure: jest.fn().mockReturnValue(mockReturnValue),
  FetchUserReady: jest.fn().mockReturnValue(mockReturnValue),
  FetchUserStart: jest.fn().mockReturnValue(mockReturnValue),
  FetchUserSuccess: jest.fn().mockReturnValue(mockReturnValue),
  Reset: jest.fn().mockReturnValue(mockReturnValue),
};

describe("UserReducer", () => {
  let received: UserStateInterface | null;

  beforeEach(() => {
    received = null;
    jest.clearAllMocks();
  });

  const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

  const arrange = (
    action: UserActionType | { type: "NoAction" },
    initialProps: UserStateInterface
  ) => {
    return UserReducer({ ...initialProps }, action as UserActionType);
  };

  it("should handle AuthExpired correctly", () => {
    const action = {
      type: "AuthExpired",
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.AuthExpired).toBeCalledTimes(1);
    expect(mockStates.AuthExpired).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle FetchUserFailure correctly", () => {
    const action = {
      type: "FetchUserFailure" as const,
    };
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.FetchUserFailure).toBeCalledTimes(1);
    expect(mockStates.FetchUserFailure).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle FetchUserReady correctly", () => {
    const action = {
      type: "FetchUserReady" as const,
    };
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.FetchUserReady).toBeCalledTimes(1);
    expect(mockStates.FetchUserReady).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle FetchUserStart correctly", () => {
    const action = {
      type: "FetchUserStart" as const,
      username: "test-user",
    };
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.FetchUserStart).toBeCalledTimes(1);
    expect(mockStates.FetchUserStart).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle FetchUserSuccess correctly", () => {
    const action = {
      type: "FetchUserSuccess",
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.FetchUserSuccess).toBeCalledTimes(1);
    expect(mockStates.FetchUserSuccess).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle Reset correctly", () => {
    const action = {
      type: "Reset",
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.Reset).toBeCalledTimes(1);
    expect(mockStates.Reset).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });
});
