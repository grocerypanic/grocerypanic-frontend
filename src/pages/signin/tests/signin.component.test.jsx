import React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";
import * as Icons from "@material-ui/icons/LockOutlined";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";

import SocialLoginController, {
  providers,
} from "../../../components/social-login-controller/social-login-controller.container";
import Copyright from "../../../components/copyright/copyright.component";
import Signin from "../signin.page";

import Strings from "../../../configuration/strings";

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
const triggerLogin = jest.fn();

Icons.default.mockImplementation(() => <div>MockLock</div>);
SocialLoginController.mockImplementation(() => <div>SocialLoginButton</div>);
Copyright.mockImplementation(() => <div>MockCopyRight</div>);

const originalEnvironment = process.env;

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FACEBOOK_ACCOUNT_ID = "MOCK_FACEBOOK_ACCOUNT";
    process.env.GOOGLE_ACCOUNT_ID = "MOCK_GOOGLE_ACCOUNT";
    render(<Signin triggerLogin={triggerLogin} />);
  });
  afterAll(() => {
    process.env = originalEnvironment;
  });

  afterEach(cleanup);

  it("should render all the subcomponents with proper props", async (done) => {
    await waitFor(() => expect(Icons.default).toBeCalledTimes(1));
    expect(SocialLoginController).toBeCalledTimes(2);
    expect(Copyright).toBeCalledTimes(1);
    done();
  });

  it("should render the google social login component with correct props", async (done) => {
    await waitFor(() => expect(SocialLoginController).toBeCalledTimes(2));

    // Google Button
    const call1 = SocialLoginController.mock.calls[0][0];
    expect(call1.ButtonType).toBe(GoogleLoginButton);
    expect(call1.appId).toBe(process.env.GOOGLE_ACCOUNT_ID);
    expect(call1.message).toBe(Strings.LoginMessageGoogle);
    expect(call1.provider).toBe(providers.google);
    expect(call1.triggerLogin).toBeInstanceOf(Function);
    call1.triggerLogin();
    expect(triggerLogin).toHaveBeenCalledWith(providers.google);
    triggerLogin.mockClear();

    done();
  });

  it("should render the facebook social login component with correct props", async (done) => {
    await waitFor(() => expect(SocialLoginController).toBeCalledTimes(2));

    // Facebook Button
    const call2 = SocialLoginController.mock.calls[1][0];
    expect(call2.ButtonType).toBe(FacebookLoginButton);
    expect(call2.appId).toBe(process.env.FACEBOOK_ACCOUNT_ID);
    expect(call2.message).toBe(Strings.LoginMessageFacebook);
    expect(call2.provider).toBe(providers.facebook);
    expect(call2.triggerLogin).toBeInstanceOf(Function);
    call2.triggerLogin();
    expect(triggerLogin).toHaveBeenCalledWith(providers.facebook);

    done();
  });
});
