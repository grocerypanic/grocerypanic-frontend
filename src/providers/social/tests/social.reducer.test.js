import SocialActions from "../social.actions";
import InitialState from "../social.initial";
import SocialReducer from "../social.reducer";

describe("Check The Reducer Functionality", () => {
  let received;
  beforeEach(() => {
    received = {};
  });

  it("should have the expected default values", () => {
    const received = SocialReducer(InitialState, { type: "NoAction" });
    expect(received).toBe(InitialState);
  });

  it("handles ToggleLogin correctly", () => {
    // toggle on
    received = SocialReducer(InitialState, {
      type: SocialActions.ToggleLogin,
    });
    expect(received.login).toBe(true);
    // toggle off
    received = SocialReducer(received, {
      type: SocialActions.ToggleLogin,
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
      type: SocialActions.StartFetchUser,
      func: mockAsync,
      payload: mockPayload,
      dispatch: SocialReducer,
    };
    const received = SocialReducer(InitialState, action);
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
    const received = SocialReducer(InitialState, {
      type: SocialActions.SuccessFetchUser,
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
      errorMessage: null,
    };
    const received = SocialReducer(InitialState, {
      type: SocialActions.FailureFetchUser,
      payload,
    });
    expect(received.avatar).toBe("");
    expect(received.email).toBe("");
    expect(received.username).toBe(payload.username);
    expect(received.error).toBe(true);
    expect(received.login).toBe(false);
    expect(received.errorMessage).toBe("SignIn.ErrorLoginFailure");
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
    const received = SocialReducer(InitialState, {
      type: SocialActions.ResetUser,
      payload,
    });
    expect(received.avatar).toBe("");
    expect(received.email).toBe("");
    expect(received.username).toBe("");
    expect(received.error).toBe(false);
    expect(received.login).toBe(false);
    expect(received.errorMessage).toBe(null);
  });

  it("handles AuthExpired correctly", () => {
    const payload = {
      username: "someguy",
      email: "someguy@payload.com",
      avatar: "someAvatar",
      login: true,
      error: false,
      errorMessage: null,
    };
    const received = SocialReducer(InitialState, {
      type: SocialActions.AuthExpired,
      payload,
    });
    expect(received.avatar).toBe("");
    expect(received.email).toBe("");
    expect(received.username).toBe("someguy");
    expect(received.error).toBe(true);
    expect(received.login).toBe(false);
    expect(received.errorMessage).toBe("SignIn.ErrorAuthExpired");
  });

  it("handles DuplicateAccount correctly", () => {
    const payload = {
      username: "someguy",
      email: "someguy@payload.com",
      avatar: "someAvatar",
      login: true,
      error: false,
      errorMessage: null,
    };
    const received = SocialReducer(InitialState, {
      type: SocialActions.DuplicateAccount,
      payload,
    });
    expect(received.avatar).toBe("");
    expect(received.email).toBe("");
    expect(received.username).toBe("");
    expect(received.error).toBe(true);
    expect(received.login).toBe(false);
    expect(received.errorMessage).toBe("SignIn.ErrorDuplicateAccount");
  });
});
