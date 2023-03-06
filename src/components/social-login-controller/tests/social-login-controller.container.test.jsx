import { render } from "@testing-library/react";
import React from "react";
import SocialLogin from "react-social-login";
import { Providers } from "../../../configuration/backend";
import { propCount } from "../../../test.fixtures/objectComparison";
import StandBy from "../../social-login-standby/social-login-standby.component";

jest.mock("react-social-login");
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

const buttonProps = {
  ButtonType: MockGoogleLoginButton,
  message: "TestMessage",
  fallbackMessage: "Connecting ...",
  appId: process.env.REACT_APP_GOOGLE_ACCOUNT_ID,
  onLoginSuccess: jest.fn(),
  onLoginFailure: jest.fn(),
  provider: Providers.google,
};

describe("SocialLoginController", () => {
  let SocialLoginController;
  let utils;

  const reloadModule = () => {
    jest.isolateModules(() => {
      SocialLoginController =
        require("../social-login-controller.container").default;
    });
  };

  const arrange = () => {
    utils = render(<SocialLoginController {...buttonProps} />);
  };

  describe("when social login is ready", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      SocialLogin.mockImplementation((Component) => Component);
      reloadModule();
      arrange();
    });

    it("should render with the button text", async () => {
      expect(await utils.findByText(buttonProps.message)).toBeTruthy();
    });

    it("should NOT render with the fallback message", () => {
      expect(utils.queryByText(buttonProps.fallbackMessage)).not.toBeTruthy();
    });

    it("should call the underlying button with the correct props", async () => {
      expect(utils.getByTestId("SocialLoginButton")).toBeTruthy();
      expect(MockGoogleLoginButton).toHaveBeenCalledTimes(1);
      propCount(MockGoogleLoginButton.mock.calls[0][0], 2);
      expect(MockGoogleLoginButton).toHaveBeenCalledWith(
        {
          onClick: buttonProps.triggerLogin,
          children: buttonProps.message,
        },
        {}
      );
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });

  describe("when social login is not ready", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      SocialLogin.mockImplementation(() => {
        const { Component } = jest.requireActual("react");
        class MockSocialLogin extends Component {
          render() {
            return null;
          }
        }
        return MockSocialLogin;
      });
      reloadModule();
      arrange();
    });

    it("should NOT render with the message prop", () => {
      expect(utils.queryByText(buttonProps.message)).not.toBeTruthy();
    });

    it("should render the fallbackMessage prop", () => {
      expect(utils.queryByText(buttonProps.fallbackMessage)).toBeTruthy();
    });

    it("should render the StandBy button with the correct props", async () => {
      expect(utils.getByTestId("PendingSocialController")).toBeTruthy();
      expect(StandBy).toHaveBeenCalledTimes(1);
      expect(StandBy).toHaveBeenCalledWith(
        {
          onClick: undefined,
          children: buttonProps.fallbackMessage,
        },
        {}
      );
    });
  });
});
