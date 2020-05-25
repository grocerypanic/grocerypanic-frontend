import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";

import SignIn from "../signin.page";
import SignInContainer from "../signin.container";

jest.mock("../signin.page");

SignIn.mockImplementation(() => <div>MockSignin</div>);

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    currentTest = tests.shift();
    utils = render(<SignInContainer />);
  });

  afterEach(cleanup);

  it("should render with the correct function", async (done) => {
    expect(currentTest).toBe(1);
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    const call1 = SignIn.mock.calls[0][0];
    expect(call1.triggerLogin).toBeInstanceOf(Function);
    call1.triggerLogin();
    done();
  });
});
