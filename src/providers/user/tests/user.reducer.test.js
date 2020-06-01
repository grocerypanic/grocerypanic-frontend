import UserReducer from "../user.reducer";
import UserActions from "../user.actions";

import InitialState from "../user.initial";

describe("Check The Reducer Functionality", () => {
  let received;
  beforeEach(() => {
    received = {};
  });

  it("should have the expected default values", () => {
    const received = UserReducer(InitialState, { type: "NoAction" });
    expect(received).toBe(InitialState);
  });

  it("handles ToggleLogin correctly", () => {
    // toggle on
    received = UserReducer(InitialState, {
      type: UserActions.ToggleLogin,
    });
    expect(received.login).toBe(true);
    // toggle off
    received = UserReducer(received, {
      type: UserActions.ToggleLogin,
    });
    expect(received.login).toBe(false);
  });

  it("handles StartFetchUser correctly", () => {
    const mockAsync = jest.fn();
    const ModifiedInitialState = {
      ...InitialState,
      login: false,
    };
    mockAsync.mockReturnValue("ReturnValue");
    const mockPayload = { mock: "data" };
    const action = {
      type: UserActions.StartFetchUser,
      func: mockAsync,
      payload: mockPayload,
      dispatch: UserReducer,
    };
    const received = UserReducer(InitialState, action);
    expect(received).toEqual(ModifiedInitialState);
    expect(mockAsync.mock.calls.length).toBe(1);
    expect(mockAsync.mock.calls[0]).toEqual([
      {
        state: InitialState,
        action,
      },
    ]);
  });

  it("handles SuccessFetchUser correctly", () => {
    const payload = {
      username: "someguy",
      email: "some@email",
      avatar: "some://url",
    };
    const received = UserReducer(InitialState, {
      type: UserActions.SuccessFetchUser,
      payload,
    });
    expect(received.avatar).toBe("some://url");
    expect(received.email).toBe("some@email");
    expect(received.username).toBe("someguy");
    expect(received.error).toBe(false);
    expect(received.login).toBe(true);
  });

  it("handles FailureFetchUser correctly", () => {
    const payload = {
      username: "someguy",
      email: "some@email",
      avatar: "some://url",
    };
    const received = UserReducer(InitialState, {
      type: UserActions.FailureFetchUser,
      payload,
    });
    expect(received.avatar).toBe("");
    expect(received.email).toBe("");
    expect(received.username).toBe(payload.username);
    expect(received.error).toBe(true);
    expect(received.login).toBe(false);
    expect(received.errorMessage).toBe("LoginFailure");
  });

  it("handles ResetUser correctly", () => {
    const payload = {
      username: "someguy",
      email: "someguy@payload.com",
      avatar: "someAvatar",
      login: true,
      error: true,
      errorMessage: "Error",
    };
    const received = UserReducer(InitialState, {
      type: UserActions.ResetUser,
      payload,
    });
    expect(received.avatar).toBe("");
    expect(received.email).toBe("");
    expect(received.username).toBe("");
    expect(received.error).toBe(false);
    expect(received.login).toBe(false);
    expect(received.errorMessage).toBe(null);
  });
});
