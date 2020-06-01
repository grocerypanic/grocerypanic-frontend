import React from "react";
import { render, cleanup } from "@testing-library/react";
import { GoogleLoginButton } from "react-social-login-buttons";

import SocialLoginController from "../social-login-controller.container";
import { Providers } from "../../../configuration/backend";

const buttonProps = {
  ButtonType: GoogleLoginButton,
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
  });
});
