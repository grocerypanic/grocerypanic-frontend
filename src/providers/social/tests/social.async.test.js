import { waitFor } from "@testing-library/react";
import { Providers, Paths, Constants } from "../../../configuration/backend";
import Request from "../../../util/requests";
import SocialActions from "../social.actions";
import {
  resetLogin,
  asyncLogin,
  loginError,
  authExpired,
} from "../social.async";

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
    _profile: null,
    path: Paths.googleLogin,
    status: 200,
    response: {
      user: { username: "SomeGuy", avatar: "SomeAvatar", email: "SomeEmail" },
    },
  },
  {
    _provider: Providers.google,
    _token: { accessToken: "MockAccessToken", idToken: "MockCode" },
    _profile: null,
    path: Paths.googleLogin,
    status: 404,
    response: {
      user: { username: "SomeGuy", avatar: "SomeAvatar", email: "SomeEmail" },
    },
  },
  {
    _provider: Providers.facebook,
    _token: { accessToken: "MockAccessToken", idToken: "MockCode" },
    _profile: { name: "SomeGuy", avatar: "SomeAvatar", email: "SomeEmail" },
    path: Paths.facebookLogin,
    status: 200,
    response: {},
  },
  {
    _provider: Providers.facebook,
    _token: { accessToken: "MockAccessToken", idToken: "MockCode" },
    _profile: { name: "SomeGuy", avatar: "SomeAvatar", email: "SomeEmail" },
    path: Paths.facebookLogin,
    status: 404,
    response: {},
  },
  {
    _provider: Providers.google,
    _token: { accessToken: "MockAccessToken", idToken: "MockCode" },
    _profile: null,
    path: Paths.googleLogin,
    status: 400,
    response: { non_field_errors: [Constants.alreadyRegistered] },
  },
];

describe("Setup for Testing asyncLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockData = mockLoginState.shift();
    Request.mockReturnValue([mockData.response, mockData.status]);
  });

  it("should fail immediately if the provider is not supported", async () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Request).toBeCalledTimes(0);
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: SocialActions.FailureFetchUser,
      payload: {
        username: "",
      },
    });
  });

  it("should post google login data to the api, and then dispatch accordingly on success", async () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Request).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: SocialActions.SuccessFetchUser,
      payload: {
        username: mockData._profile.name,
        avatar: mockData._profile.profilePicURL,
        email: mockData._profile.email,
      },
    });
  });

  it("should post google login data to the api, and then dispatch accordingly on failures", async () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Request).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: SocialActions.FailureFetchUser,
      payload: {
        username: "",
      },
    });
  });

  it("should post facebook login data to the api, and then dispatch accordingly on success", async () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Request).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: SocialActions.SuccessFetchUser,
      payload: {
        username: mockData._profile.name,
        avatar: mockData._profile.profilePicURL,
        email: mockData._profile.email,
      },
    });
  });

  it("should post facebook login data to the api, and then dispatch accordingly on failures", async () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Request).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: SocialActions.FailureFetchUser,
      payload: {
        username: mockData._profile.name,
      },
    });
  });

  it("should post google login data to the api, and then dispatch accordingly on the duplicate account case", async () => {
    asyncLogin({
      state: "MockState",
      action: { payload: mockData, dispatch: mockDispatch },
    });
    expect(Request).toBeCalledWith("POST", mockData.path, {
      access_token: mockData._token.accessToken,
      code: mockData._token.idToken,
    });
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: SocialActions.DuplicateAccount,
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
      type: SocialActions.ResetUser,
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
      type: SocialActions.FailureFetchUser,
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
      type: SocialActions.AuthExpired,
      payload: { username: "" },
    });
  });
});
