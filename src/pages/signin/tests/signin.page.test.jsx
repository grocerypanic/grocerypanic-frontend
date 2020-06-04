import React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import * as Icons from "@material-ui/icons/LockOutlined";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";

import SocialLoginController from "../../../components/social-login-controller/social-login-controller.container";
import Copyright from "../../../components/copyright/copyright.component";
import Signin from "../signin.page";

import Strings from "../../../configuration/strings";
import { Providers } from "../../../configuration/backend";

jest.mock(
  "../../../components/social-login-controller/social-login-controller.container",
  () => ({
    __esModule: true,
    default: jest.fn(),
    providers: jest.requireActual(
      "../../../components/social-login-controller/social-login-controller.container"
    ).providers,
  })
);
jest.mock("@material-ui/icons/LockOutlined", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../../components/copyright/copyright.component");
const handleSocialLogin = jest.fn();
const handleSocialLoginError = jest.fn();

Icons.default.mockImplementation(() => <div>MockLock</div>);
SocialLoginController.mockImplementation(() => <div>SocialLoginButton</div>);
Copyright.mockImplementation(() => <div>MockCopyRight</div>);

const originalEnvironment = process.env;

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_FACEBOOK_ACCOUNT_ID = "MOCK_FACEBOOK_ACCOUNT";
    process.env.REACT_APP_GOOGLE_ACCOUNT_ID = "MOCK_GOOGLE_ACCOUNT";
    render(
      <Signin
        handleSocialLogin={handleSocialLogin}
        handleSocialLoginError={handleSocialLoginError}
      />
    );
  });
  afterAll(() => {
    process.env = originalEnvironment;
  });

  afterEach(cleanup);

  it("should render all the subcomponents as expected", async (done) => {
    await waitFor(() => expect(Icons.default).toBeCalledTimes(1));
    expect(SocialLoginController).toBeCalledTimes(2);
    expect(Copyright).toBeCalledTimes(1);
    done();
  });

  it("should render the google social login component with correct props", async (done) => {
    await waitFor(() => expect(SocialLoginController).toBeCalledTimes(2));

    // Google Button
    const call1 = SocialLoginController.mock.calls[0][0];
    propCount(call1, 6);
    expect(call1.ButtonType).toBe(GoogleLoginButton);
    expect(call1.appId).toBe(process.env.REACT_APP_GOOGLE_ACCOUNT_ID);
    expect(call1.message).toBe(Strings.LoginMessageGoogle);
    expect(call1.provider).toBe(Providers.google);
    expect(call1.onLoginSuccess).toBe(handleSocialLogin);
    expect(call1.onLoginFailure).toBe(handleSocialLoginError);
    done();
  });

  it("should render the facebook social login component with correct props", async (done) => {
    await waitFor(() => expect(SocialLoginController).toBeCalledTimes(2));

    // Facebook Button
    const call2 = SocialLoginController.mock.calls[1][0];
    propCount(call2, 6);
    expect(call2.ButtonType).toBe(FacebookLoginButton);
    expect(call2.appId).toBe(process.env.REACT_APP_FACEBOOK_ACCOUNT_ID);
    expect(call2.message).toBe(Strings.LoginMessageFacebook);
    expect(call2.provider).toBe(Providers.facebook);
    expect(call2.onLoginSuccess).toBe(handleSocialLogin);
    expect(call2.onLoginFailure).toBe(handleSocialLoginError);
    done();
  });
});
