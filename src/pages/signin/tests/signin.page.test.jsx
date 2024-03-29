import * as Icons from "@material-ui/icons/LockOpen";
import { render, waitFor, cleanup } from "@testing-library/react";
import React from "react";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";
import Copyright from "../../../components/copyright/copyright.component";
import SocialLoginControllerGoogle from "../../../components/social-login-controller-google/social-login-controller-google.container";
import SocialLoginController from "../../../components/social-login-controller/social-login-controller.container";
import { Providers } from "../../../configuration/backend";
import Strings from "../../../configuration/strings";
import { propCount } from "../../../test.fixtures/objectComparison";
import Signin from "../signin.page";

jest.mock(
  "../../../components/social-login-controller/social-login-controller.container",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);
jest.mock(
  "../../../components/social-login-controller-google/social-login-controller-google.container",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);
jest.mock("@material-ui/icons/LockOpen", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../../components/copyright/copyright.component");
const handleSocialLogin = jest.fn();
const handleSocialLoginError = jest.fn();

Icons.default.mockImplementation(() => <div>MockLock</div>);
SocialLoginController.mockImplementation(() => <div>SocialLoginButton</div>);
SocialLoginControllerGoogle.mockImplementation(() => (
  <div>SocialLoginGoogleButton</div>
));
Copyright.mockImplementation(() => <div>MockCopyRight</div>);

const originalEnvironment = process.env;

describe("Setup Environment", () => {
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_FACEBOOK_ACCOUNT_ID = "MOCK_FACEBOOK_ACCOUNT";
    process.env.REACT_APP_GOOGLE_ACCOUNT_ID = "MOCK_GOOGLE_ACCOUNT";
    utils = render(
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

  it("should render all the sub-components as expected", async () => {
    await waitFor(() => expect(Icons.default).toBeCalledTimes(1));
    expect(SocialLoginController).toBeCalledTimes(1);
    expect(SocialLoginControllerGoogle).toBeCalledTimes(1);
    expect(Copyright).toBeCalledTimes(1);
  });

  it("should render the google social login component with correct props", async () => {
    await waitFor(() => expect(SocialLoginControllerGoogle).toBeCalledTimes(1));

    // Google Button
    const call1 = SocialLoginControllerGoogle.mock.calls[0][0];
    propCount(call1, 5);
    expect(call1.ButtonType).toBe(GoogleLoginButton);
    expect(call1.message).toBe(Strings.SignIn.LoginMessageGoogle);
    expect(call1.fallbackMessage).toBe(Strings.SignIn.PendingSocialConnection);
    expect(call1.onLoginSuccess).toBe(handleSocialLogin);
    expect(call1.onLoginFailure).toBe(handleSocialLoginError);
  });

  it("should render the facebook social login component with correct props", async () => {
    await waitFor(() => expect(SocialLoginController).toBeCalledTimes(1));

    // Facebook Button
    const call2 = SocialLoginController.mock.calls[0][0];
    propCount(call2, 7);
    expect(call2.ButtonType).toBe(FacebookLoginButton);
    expect(call2.appId).toBe(process.env.REACT_APP_FACEBOOK_ACCOUNT_ID);
    expect(call2.message).toBe(Strings.SignIn.LoginMessageFacebook);
    expect(call2.fallbackMessage).toBe(Strings.SignIn.PendingSocialConnection);
    expect(call2.provider).toBe(Providers.facebook);
    expect(call2.onLoginSuccess).toBe(handleSocialLogin);
    expect(call2.onLoginFailure).toBe(handleSocialLoginError);
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container).toMatchSnapshot();
  });
});
