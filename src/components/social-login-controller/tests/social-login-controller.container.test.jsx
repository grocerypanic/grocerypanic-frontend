import { render, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { Providers } from "../../../configuration/backend";
import Strings from "../../../configuration/strings";
import { propCount } from "../../../test.fixtures/objectComparison";
import SocialLoginController from "../social-login-controller.container";
import StandBy from "../social-login-controller.standby";

console.warn = jest.fn(); // suppress warnings from the react-social-login library

jest.mock("../social-login-controller.standby");
const MockGoogleLoginButton = jest.fn();
StandBy.mockImplementation(({ children }) => <div>{children}</div>);
MockGoogleLoginButton.mockImplementation(({ children }) => (
  <div>{children}</div>
));

const buttonProps = {
  ButtonType: MockGoogleLoginButton,
  message: "TestMessage",
  triggerLogin: jest.fn(),
  appId: process.env.REACT_APP_GOOGLE_ACCOUNT_ID,
  provider: Providers.google,
};

describe("Setup Environment", () => {
  let utils;

  describe("Google and Facebook Auth Loaded ...", () => {
    beforeEach(() => {
      window.gapi = "PlaceHolder";
      window.FB = "Placeholder";
      jest.clearAllMocks();
      utils = render(<SocialLoginController {...buttonProps} />);
    });

    afterEach(cleanup);
    afterAll(() => {
      delete window.gapi;
      delete window.FB;
    });

    it("should issue a warning about depreciating methods in the react-social-login library", () => {
      expect(console.warn).toBeCalledTimes(1);
      expect(console.warn.mock.calls).toMatchSnapshot();
    });

    it("should render with the correct message", () => {
      expect(utils.getByText(buttonProps.message)).toBeTruthy();
      expect(utils.getByTestId("SocialController")).toBeTruthy();
      expect(StandBy).toHaveBeenCalledTimes(0);
      expect(MockGoogleLoginButton).toHaveBeenCalledTimes(2);
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

  describe("Google and Facebook Auth Not Loaded ...", () => {
    beforeEach(() => {
      if (window.gapi) delete window.gapi;
      if (window.FB) delete window.FB;
      jest.clearAllMocks();
      utils = render(<SocialLoginController {...buttonProps} />);
    });

    afterEach(cleanup);

    it("should render with the correct message", () => {
      expect(utils.queryByText(buttonProps.message)).not.toBeTruthy();
      expect(
        utils.queryByText(Strings.SignIn.PendingSocialConnection)
      ).toBeTruthy();
      expect(utils.getByTestId("PendingSocialController")).toBeTruthy();
      expect(MockGoogleLoginButton).toHaveBeenCalledTimes(0);
      expect(StandBy).toHaveBeenCalledTimes(2);

      const call1 = StandBy.mock.calls[0][0];
      propCount(call1, 1);
      expect(call1.children).toBe(Strings.SignIn.PendingSocialConnection);

      const call2 = StandBy.mock.calls[1][0];
      propCount(call2, 1);
      expect(call2.children).toBe(Strings.SignIn.PendingSocialConnection);
    });

    it("should process a click without doing anything", () => {
      const node = utils.getByTestId("PendingSocialController").children[0];
      fireEvent.click(node, "click");
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });
});
