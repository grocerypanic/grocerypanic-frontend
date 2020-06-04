import React from "react";
import { render, cleanup } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import SocialLoginController from "../social-login-controller.container";
import { Providers } from "../../../configuration/backend";

jest.mock("react-social-login-buttons");
const MockGoogleLoginButton = jest.fn();
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
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<SocialLoginController {...buttonProps} />);
  });

  afterEach(cleanup);

  it("should render with the correct message", () => {
    expect(currentTest).toBe(1);
    expect(utils.getByText(buttonProps.message)).toBeTruthy();
    expect(utils.getByTestId("SocialController")).toBeTruthy();
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
});
