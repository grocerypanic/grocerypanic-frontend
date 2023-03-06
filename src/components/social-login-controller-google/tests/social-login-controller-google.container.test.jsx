import { useGoogleLogin } from "@react-oauth/google";
import { render } from "@testing-library/react";
import React from "react";
import { Providers } from "../../../configuration/backend";
import { propCount } from "../../../test.fixtures/objectComparison";
import StandBy from "../../social-login-standby/social-login-standby.component";
import SocialLoginControllerGoogle from "../social-login-controller-google.container";

jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn(),
}));

jest.mock("../../social-login-standby/social-login-standby.component", () =>
  jest.fn((props) =>
    jest
      .requireActual(
        "../../social-login-standby/social-login-standby.component"
      )
      .default(props)
  )
);

const MockGoogleLoginButton = jest.fn();
MockGoogleLoginButton.mockImplementation(({ children }) => (
  <div>{children}</div>
));

const props = {
  ButtonType: MockGoogleLoginButton,
  fallbackMessage: "fallBackMessage",
  message: "TestMessage",
  onLoginSuccess: jest.fn(),
  onLoginFailure: jest.fn(),
};

describe("SocialLoginControllerGoogle", () => {
  let utils;
  const mockLoginFunction = jest.fn();

  const arrange = () => {
    useGoogleLogin.mockImplementation(() => mockLoginFunction);
    utils = render(<SocialLoginControllerGoogle {...props} />);
  };

  describe("when the sdk is loaded", () => {
    beforeEach(() => {
      global.google = { accounts: {} };
      jest.clearAllMocks();
      arrange();
    });

    it("should call the useGoogleLogin hook with the expected arguments", () => {
      expect(useGoogleLogin).toBeCalledTimes(1);
      const hookProps = useGoogleLogin.mock.calls[0][0];
      propCount(hookProps, 4);
      expect(hookProps.flow).toBe("auth-code");
      expect(hookProps.onFailure).toBe(hookProps.onLoginFailure);
      expect(typeof hookProps.onSuccess).toBe("function");
      expect(hookProps.select_account).toBe(true);
    });

    it("should render the ButtonType with the correct props", () => {
      expect(MockGoogleLoginButton).toBeCalledTimes(1);
      const call = MockGoogleLoginButton.mock.calls[0][0];
      propCount(call, 2);
      expect(call.onClick).toBe(mockLoginFunction);
      expect(call.children).toBe(props.message);
    });

    it("should render the Message Text", () => {
      expect(utils.getByText(props.message)).toBeTruthy();
    });

    describe("when a login is triggered", () => {
      const loginProps = {
        access_token: "mock_access_token",
        code: "mock_response_code",
      };

      beforeEach(() => {
        const { onSuccess } = useGoogleLogin.mock.calls[0][0];
        onSuccess(loginProps);
      });

      it("should call the onLoginSuccess prop with the remapped object", () => {
        expect(props.onLoginSuccess).toBeCalledWith({
          _provider: Providers.google,
          _token: {
            access_token: loginProps.access_token,
            idToken: loginProps.code,
          },
        });
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe("when the sdk is NOT loaded", () => {
    beforeEach(() => {
      global.google = undefined;
      jest.clearAllMocks();
      arrange();
    });

    it("should call the useGoogleLogin hook with the expected arguments", () => {
      expect(useGoogleLogin).toBeCalledTimes(1);
      const hookProps = useGoogleLogin.mock.calls[0][0];
      propCount(hookProps, 4);
      expect(hookProps.flow).toBe("auth-code");
      expect(hookProps.onFailure).toBe(hookProps.onLoginFailure);
      expect(typeof hookProps.onSuccess).toBe("function");
      expect(hookProps.select_account).toBe(true);
    });

    it("should NOT render the ButtonType prop", () => {
      expect(MockGoogleLoginButton).toBeCalledTimes(0);
    });

    it("should NOT render the message prop", () => {
      expect(utils.queryByText(props.message)).toBeNull();
    });

    it("should render the fallbackMessage prop", () => {
      expect(utils.queryByText(props.fallbackMessage)).toBeTruthy();
    });

    it("should call the StandBy button with the correct props", async () => {
      expect(StandBy).toHaveBeenCalledTimes(1);
      expect(StandBy).toHaveBeenCalledWith(
        {
          onClick: undefined,
          children: props.fallbackMessage,
        },
        {}
      );
    });
  });
});
