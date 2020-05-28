import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../app.js";
import SignIn from "../../signin/signin.container";
import ShelvesPage from "../../shelves/shelves.page";
import AnalyticsProvider from "../../../providers/analytics/analytics.provider";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";

jest.mock("../../signin/signin.container");
jest.mock("../../shelves/shelves.page");
jest.mock("../../../providers/analytics/analytics.provider");
SignIn.mockImplementation(() => <div>MockPlaceholder</div>);
ShelvesPage.mockImplementation(() => <div>MockPlaceholder</div>);
AnalyticsProvider.mockImplementation(({ children }) => <div>{children}</div>);

describe("Check Routing", () => {
  let tests = [{ path: Routes.root }, { path: Routes.shelves }];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(ShelvesPage).toBeCalledTimes(0);
    expect(AnalyticsProvider).toBeCalledTimes(1);
    done();
  });

  it("should render the shelves page correctly", async (done) => {
    expect(utils.getByText(Strings.Suspense)).toBeTruthy();
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(1));
    expect(SignIn).toBeCalledTimes(0);
    expect(AnalyticsProvider).toBeCalledTimes(1);
    done();
  });
});
