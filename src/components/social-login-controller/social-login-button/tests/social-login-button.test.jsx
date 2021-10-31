import { render } from "@testing-library/react";
import React from "react";
import { Providers } from "../../../../configuration/backend";
import { propCount } from "../../../../test.fixtures/objectComparison";
import SocialLoginButton from "../social-login-button";

const MockGoogleLoginButton = jest.fn();
MockGoogleLoginButton.mockImplementation(({ children }) => (
  <div>{children}</div>
));

const buttonProps = {
  ButtonType: MockGoogleLoginButton,
  message: "TestMessage",
  fallbackMessage: "Connecting ...",
  triggerLogin: jest.fn(),
  appId: process.env.REACT_APP_GOOGLE_ACCOUNT_ID,
  provider: Providers.google,
};

describe("SocialLoginControllerReady", () => {
  let utils;

  const arrange = () => {
    utils = render(<SocialLoginButton {...buttonProps} />);
  };

  describe("when social login is ready", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      arrange();
    });

    it("should render with the button text", async () => {
      expect(await utils.findByText(buttonProps.message)).toBeTruthy();
      expect(await utils.findByTestId("SocialLoginButton")).toBeTruthy();
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
});
