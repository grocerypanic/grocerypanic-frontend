import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";

import { UserContext } from "../../../providers/user/user.provider";
import initialState from "../../../providers/user/user.initial";
import {
  triggerLogin,
  resetLogin,
  loginError,
} from "../../../providers/user/user.async";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";

import SignInContainer from "../signin.container";
import SignIn from "../signin.page";
import ErrorDialogue from "../../../components/error-dialogue/error-dialogue.component";

import Routes from "../../../configuration/routes";

jest.mock("../signin.page");

jest.mock("../../../providers/user/user.async");
triggerLogin.mockImplementation(() => <div>MockTrigger</div>);
resetLogin.mockImplementation(() => <div>MockReset</div>);

jest.mock("../../../components/error-dialogue/error-dialogue.component");
ErrorDialogue.mockImplementation(() => <div>MockError</div>);

SignIn.mockImplementation(() => <div>MockSignin</div>);
const mockDispatch = jest.fn();

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(
      <UserContext.Provider
        value={{ user: initialState, dispatch: mockDispatch }}
      >
        <SignInContainer />
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render with the handler functions", async (done) => {
    expect(currentTest).toBe(1);
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    const call1 = SignIn.mock.calls[0][0];
    expect(call1.handleSocialLogin).toBeInstanceOf(Function);
    done();
  });
});

describe("Setup Environment for Handlers", () => {
  let tests = [
    { ...initialState },
    { ...initialState },
    { ...initialState, error: true, errorMessage: "Login Failures" },
    { ...initialState, error: true, errorMessage: "Login Failures" },
  ];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(
      <UserContext.Provider
        value={{ user: currentTest, dispatch: mockDispatch }}
      >
        <SignInContainer />
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should export a function handleSocialLogin, that works as expected", async (done) => {
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
    const call1 = SignIn.mock.calls[0][0];
    call1.handleSocialLogin("mockResponse");
    expect(triggerLogin).toBeCalledTimes(1);
    expect(loginError).toBeCalledTimes(0);
    expect(resetLogin).toBeCalledTimes(0);
    const triggerCall = triggerLogin.mock.calls[0];
    expect(triggerCall[0]).toBeInstanceOf(Function);
    expect(triggerCall[1]).toBe("mockResponse");
    done();
  });

  it("should export a function handleSocialLoginError, that works as expected", async (done) => {
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
    const call1 = SignIn.mock.calls[0][0];
    call1.handleSocialLoginError("");
    expect(triggerLogin).toBeCalledTimes(0);
    expect(loginError).toBeCalledTimes(1);
    expect(resetLogin).toBeCalledTimes(0);
    const errorCall = loginError.mock.calls[0];
    expect(errorCall[0]).toBeInstanceOf(Function);
    done();
  });

  it("should handle an error condition as expected", async (done) => {
    await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(1));
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    const call1 = ErrorDialogue.mock.calls[0][0];
    expect(call1.clearError).toBeInstanceOf(Function);
    expect(call1.message).toBe(currentTest.errorMessage);
    expect(call1.redirect).toBe(Routes.root);
    done();
  });

  it("should export a function handleSocialLoginError, that works as expected on an error", async (done) => {
    await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(1));
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    const call1 = ErrorDialogue.mock.calls[0][0];
    call1.clearError("mockResponse");
    expect(call1.eventError).toBe(AnalyticsActions.LoginError);
    expect(triggerLogin).toBeCalledTimes(0);
    expect(resetLogin).toBeCalledTimes(1);
    expect(loginError).toBeCalledTimes(0);
    const resetCall = resetLogin.mock.calls[0];
    expect(resetCall[0]).toBeInstanceOf(Function);
    done();
  });
});

describe("Setup Environment for Async Dispatch Test", () => {
  let tests = [{ ...initialState }];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(
      <UserContext.Provider
        value={{ user: currentTest, dispatch: mockDispatch }}
      >
        <SignInContainer />
      </UserContext.Provider>
    );
  });

  it("should a useEffect hook instead of calling dispatch directly", async (done) => {
    await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));

    const call1 = SignIn.mock.calls[0][0];
    call1.handleSocialLogin("mockResponse");
    expect(triggerLogin).toBeCalledTimes(1);
    const modifyState = triggerLogin.mock.calls[0][0];
    act(() => modifyState("Fake Async Action"));
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith("Fake Async Action");

    done();
  });

  afterEach(cleanup);
});
