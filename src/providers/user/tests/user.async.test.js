import { waitFor } from "@testing-library/react";
import {
  triggerLogin,
  resetLogin,
  asyncLogin,
  loginError,
  authExpired,
} from "../user.async";
import UserActions from "../user.actions";

import { Providers, Paths } from "../../../configuration/backend";

import { Backend } from "../../../util/requests";

jest.mock("../../../util/requests");
const mockDispatch = jest.fn();
let mockData;

let mockLoginState = [
  {
    _provider: "Invalid Provider",
  },
  {
    _provider: Providers.google,
    _token: { accessToken: "MockAccessToken", idToken: "MockCode" },
    _profile: { name: "SomeGuy", avatar: "SomeAvatar", email: "SomeEmail" },
    path: Paths.googleLogin,
    status: 200,
  },
  {
    _provider: Providers.google,
    _token: { accessToken: "MockAccessToken", idToken: "MockCode" },
    _profile: { name: "SomeGuy", avatar: "SomeAvatar", email: "SomeEmail" },
    path: Paths.googleLogin,
    status: 400,
  },
];

describe("Setup for Testing asyncLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockData = mockLoginState.shift();
    Backend.mockReturnValue([{}, mockData.status]);
  });

  it("should skip all login activity if the provider is not supported", () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Backend).toBeCalledTimes(0);
    expect(mockDispatch).toBeCalledTimes(0);
  });

  it("should post google login data to the api, and then dispatch accordingly on success", async (done) => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Backend).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: UserActions.SuccessFetchUser,
      payload: {
        username: mockData._profile.name,
        avatar: mockData._profile.profilePicURL,
        email: mockData._profile.email,
      },
    });
    done();
  });

  it("should post google login data to the api, and then dispatch accordingly on failures", async (done) => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Backend).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: UserActions.FailureFetchUser,
      payload: {
        username: mockData.username,
      },
    });
    done();
  });
});

let responses = [{ _provider: "Invalid" }, { _provider: Providers.google }];

describe("Setup for Testing triggerLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockData = responses.shift();
  });

  it("should skip all login activity if the provider is not supported", () => {
    triggerLogin(mockDispatch, mockData);
    expect(mockDispatch).toBeCalledTimes(0);
  });

  it("should dispatch the correct action to the user reducer", () => {
    triggerLogin(mockDispatch, mockData);
    expect(mockDispatch).toBeCalledWith({
      type: UserActions.StartFetchUser,
      payload: mockData,
      func: asyncLogin,
      dispatch: mockDispatch,
    });
  });
});

describe("Setup for Testing resetLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should dispatch the correct action to the user reducer", () => {
    resetLogin(mockDispatch);
    expect(mockDispatch).toBeCalledWith({
      type: UserActions.ResetUser,
    });
  });
});

describe("Setup for Testing loginError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should dispatch the correct action to the user reducer", () => {
    loginError(mockDispatch);
    expect(mockDispatch).toBeCalledWith({
      type: UserActions.FailureFetchUser,
      payload: { username: "" },
    });
  });
});

describe("Setup for Testing authExpired", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should dispatch the correct action to the user reducer", () => {
    authExpired(mockDispatch);
    expect(mockDispatch).toBeCalledWith({
      type: UserActions.AuthExpired,
      payload: { username: "" },
    });
  });
});
