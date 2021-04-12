import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import i18next from "i18next";

import { SocialContext } from "../../../providers/social/social.provider";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { HeaderContext } from "../../../providers/header/header.provider";

import initialState from "../../../providers/social/social.initial";
import initialHeaderSettings from "../../../providers/header/header.initial";

import Strings from "../../../configuration/strings";

import {
  triggerLogin,
  resetLogin,
  loginError,
} from "../../../providers/social/social.async";

import SignInContainer from "../signin.container";
import SignIn from "../signin.page";
import ErrorDialogue from "../../../components/error-dialogue/error-dialogue.component";

jest.mock("../signin.page");

jest.mock("../../../providers/social/social.async");
triggerLogin.mockImplementation(() => <div>MockTrigger</div>);
resetLogin.mockImplementation(() => <div>MockReset</div>);

jest.mock("../../../components/error-dialogue/error-dialogue.component");
ErrorDialogue.mockImplementation(() => <div>MockError</div>);

SignIn.mockImplementation(() => <div>MockSignin</div>);
const mockDispatch = jest.fn();
const mockHeaderUpdate = jest.fn();

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

describe("Setup Environment", () => {
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  const checkHeader = () => {
    expect(mockHeaderUpdate).toBeCalledWith({
      title: "MainHeaderTitle",
      disableNav: true,
    });
    expect(i18next.t("MainHeaderTitle")).toBe(Strings.MainHeaderTitle);
  };

  const renderHelper = (props) => {
    return render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <SocialContext.Provider
            value={{ socialLogin: props, dispatch: mockDispatch }}
          >
            <SignInContainer />
          </SocialContext.Provider>
        </AnalyticsContext.Provider>
      </HeaderContext.Provider>
    );
  };

  describe("outside of an auth error", () => {
    beforeEach(() => {
      currentTest = { ...initialState, error: false };
      renderHelper(currentTest);
    });

    it("should configure the header properly", () => {
      checkHeader();
    });

    it("should render with the handler functions", async () => {
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));
      const call1 = SignIn.mock.calls[0][0];
      expect(call1.handleSocialLogin).toBeInstanceOf(Function);
    });

    it("should export a function handleSocialLogin, that works as expected", async () => {
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
      const call1 = SignIn.mock.calls[0][0];
      propCount(call1, 2);

      call1.handleSocialLogin("mockResponse");
      expect(triggerLogin).toBeCalledTimes(1);
      expect(loginError).toBeCalledTimes(0);
      expect(resetLogin).toBeCalledTimes(0);
      const triggerCall = triggerLogin.mock.calls[0];
      propCount(triggerCall, 2);

      expect(triggerCall[0]).toBeInstanceOf(Function);
      expect(triggerCall[1]).toBe("mockResponse");

      expect(mockAnalyticsContext.event).toBeCalledWith(
        AnalyticsActions.LoginSuccess
      );
    });

    it("should export a function handleSocialLoginError, that works as expected", async () => {
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
      const call1 = SignIn.mock.calls[0][0];
      propCount(call1, 2);

      call1.handleSocialLoginError("");
      expect(triggerLogin).toBeCalledTimes(0);
      expect(loginError).toBeCalledTimes(1);
      expect(resetLogin).toBeCalledTimes(0);

      const errorCall = loginError.mock.calls[0];
      expect(errorCall[0]).toBeInstanceOf(Function);
    });

    it("should use state to indirectly call dispatch", async () => {
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));

      const call1 = SignIn.mock.calls[0][0];
      call1.handleSocialLogin("mockResponse");
      expect(triggerLogin).toBeCalledTimes(1);

      const modifyState = triggerLogin.mock.calls[0][0];
      propCount(modifyState, 0);

      act(() => modifyState("Fake Async Action"));
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith("Fake Async Action");
    });
  });

  describe("during an auth error", () => {
    beforeEach(() => {
      currentTest = {
        ...initialState,
        error: true,
        errorMessage: "ErrorAuthExpired",
      };
      renderHelper(currentTest);
    });

    it("should configure the header properly", () => {
      checkHeader();
    });

    it("should handle an error condition as expected", async () => {
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(1));
      await waitFor(() => expect(SignIn).toBeCalledTimes(0));
      const call1 = ErrorDialogue.mock.calls[0][0];
      propCount(call1, 3);

      expect(call1.eventError).toBe(AnalyticsActions.LoginError);
      expect(call1.clearError).toBeInstanceOf(Function);
      expect(call1.messageTranslationKey).toBe(currentTest.errorMessage);
    });

    it("should export a function clearError, that works as expected on an error", async () => {
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(1));
      await waitFor(() => expect(SignIn).toBeCalledTimes(0));
      const call1 = ErrorDialogue.mock.calls[0][0];

      call1.clearError("mockResponse");
      const resetCall = resetLogin.mock.calls[0];
      expect(resetCall[0]).toBeInstanceOf(Function);
    });
  });
});
