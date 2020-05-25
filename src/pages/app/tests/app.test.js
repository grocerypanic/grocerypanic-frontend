import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../app.js";
import SignIn from "../../../pages/signin/signin.container";
import AnalyticsProvider from "../../../providers/analytics/analytics.provider";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";

jest.mock("../../../pages/signin/signin.container");
jest.mock("../../../providers/analytics/analytics.provider");
SignIn.mockImplementation(() => <div>MockPlaceholder</div>);
AnalyticsProvider.mockImplementation(({ children }) => <div>{children}</div>);

describe("Check Routing", () => {
  let tests = [{ path: Routes.root }];
  let utils;
  let currentTest;

  beforeEach(() => {
    SignIn.mockClear();
    AnalyticsProvider.mockClear();
    currentTest = tests.shift();
    utils = render(
      <MemoryRouter initialEntries={[currentTest.path]}>
        <App />
      </MemoryRouter>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async (done) => {
    expect(utils.getByText(Strings.Suspense)).toBeTruthy();
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    expect(AnalyticsProvider).toBeCalledTimes(1);
    done();
  });
});
