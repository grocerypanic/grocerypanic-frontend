import { render, waitFor, act } from "@testing-library/react";
import i18next from "i18next";
import React from "react";
import ErrorDialogue from "../../../components/error-dialogue/error-dialogue.component";
import HoldingPattern from "../../../components/holding-pattern/holding-pattern.component";
import Strings from "../../../configuration/strings";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import mockProfileHook from "../../../providers/api/user/tests/user.hook.mock";
import useProfile from "../../../providers/api/user/user.hook";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import useSocialLogin from "../../../providers/social/social.hook";
import initialSocialState from "../../../providers/social/social.initial";
import mockSocialHook from "../../../providers/social/tests/social.hook.mock";
import { propCount } from "../../../test.fixtures/objectComparison";
import SignInContainer from "../signin.container";
import SignIn from "../signin.page";

jest.mock("../signin.page");

jest.mock("../../../providers/social/social.hook");
jest.mock("../../../providers/api/user/user.hook");
jest.mock("../../../components/error-dialogue/error-dialogue.component");
jest.mock("../../../components/holding-pattern/holding-pattern.component");
ErrorDialogue.mockImplementation(() => <div>MockError</div>);
HoldingPattern.mockImplementation(({ children }) => children);

SignIn.mockImplementation(() => <div>MockSignin</div>);
const mockHeaderUpdate = jest.fn();

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

describe("Setup Environment", () => {
  let currentTest;
  let currentProfileHook;
  let currentSocialHook;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const checkHeader = () => {
    expect(mockHeaderUpdate).toBeCalledWith({
      title: "MainHeaderTitle",
      disableNav: true,
    });
    expect(i18next.t("MainHeaderTitle")).toBe(Strings.MainHeaderTitle);
  };

  const renderHelper = async (props) => {
    currentSocialHook = mockSocialHook();
    currentSocialHook.social.socialLogin = { ...props };
    currentProfileHook = mockProfileHook();
    useSocialLogin.mockImplementation(() => currentSocialHook);
    useProfile.mockImplementation(() => currentProfileHook);

    return render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <SignInContainer />
        </AnalyticsContext.Provider>
      </HeaderContext.Provider>
    );
  };

  describe("outside of an auth error", () => {
    beforeEach(() => {
      currentTest = { ...initialSocialState, error: false };
      renderHelper(currentTest);
    });

    it("should configure the header properly", () => {
      checkHeader();
    });

    it("should render with the SignIn component", async () => {
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    });

    it("should render with the HoldingPattern component", async () => {
      await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
    });

    it("should have a function handleSocialLogin, that works as expected", async () => {
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
      const signInCall = SignIn.mock.calls[0][0];
      propCount(signInCall, 2);

      act(() => signInCall.handleSocialLogin("mockResponse"));
      expect(currentSocialHook.social.login).toBeCalledTimes(1);
      const call = currentSocialHook.social.login.mock.calls[0];
      propCount(call, 1);
      expect(call[0]).toBe("mockResponse");

      expect(mockAnalyticsContext.event).toBeCalledWith(
        AnalyticsActions.LoginSuccess
      );
    });

    it("should have a function handleSocialLoginError, that works as expected", async () => {
      await waitFor(() => expect(SignIn).toBeCalledTimes(1));
      await waitFor(() => expect(ErrorDialogue).toBeCalledTimes(0));
      const signInCall = SignIn.mock.calls[0][0];
      propCount(signInCall, 2);

      act(() => signInCall.handleSocialLoginError());
      expect(currentSocialHook.social.error).toBeCalledTimes(1);
      const call = currentSocialHook.social.error.mock.calls[0];
      propCount(call, 0);
    });
  });

  describe("during an auth error", () => {
    beforeEach(() => {
      currentTest = {
        ...initialSocialState,
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

      call1.clearError();
      expect(currentSocialHook.social.reset).toBeCalledTimes(1);
      const call = currentSocialHook.social.reset.mock.calls[0];
      propCount(call, 0);
    });
  });

  describe("on a successful login", () => {
    beforeEach(() => {
      currentTest = {
        ...initialSocialState,
        error: false,
        login: true,
      };
      renderHelper(currentTest);
    });

    it("should call the getProfile hook method", async () => {
      await waitFor(() =>
        expect(currentProfileHook.profile.getProfile).toBeCalledTimes(1)
      );
    });
  });
});
