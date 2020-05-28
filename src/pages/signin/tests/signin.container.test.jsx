import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";

import SignIn from "../signin.page";
import SignInContainer, {
  handleSocialLogin,
  handleSocialLoginFailure,
} from "../signin.container";

jest.mock("../signin.page");

SignIn.mockImplementation(() => <div>MockSignin</div>);

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<SignInContainer />);
  });

  afterEach(cleanup);

  it("should render with the handler functions", async (done) => {
    expect(currentTest).toBe(1);
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    const call1 = SignIn.mock.calls[0][0];
    expect(call1.handleSocialLogin).toBe(handleSocialLogin);
    expect(call1.handleSocialLoginFailure).toBe(handleSocialLoginFailure);
    done();
  });
});

describe("Setup Environment for Handlers", () => {
  let tests = [1, 2];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<SignInContainer />);
  });

  afterEach(cleanup);

  it("should export a function handleSocialLogin, that works as expected", async (done) => {
    expect(currentTest).toBe(1);
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    done.fail("Not Implemented");
    handleSocialLogin();
    done();
  });

  it("should export a function handleSocialLoginFailure, that works as expected", async (done) => {
    expect(currentTest).toBe(2);
    handleSocialLoginFailure();
    done.fail("Not Implemented");
    done();
  });
});
