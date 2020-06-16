import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../app.js";
import SignIn from "../../signin/signin.container";
import ShelvesPage from "../../shelves/shelves.page";
import StoresPage from "../../stores/stores.page";
import ItemsPage from "../../items/items.page";
import DetailsPage from "../../details/details.page";
import MenuPage from "../../menu/menu.page";

import { UserContext } from "../../../providers/user/user.provider";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";

jest.mock("../../../providers/analytics/analytics.provider");

jest.mock("../../signin/signin.container");
jest.mock("../../shelves/shelves.page");
jest.mock("../../stores/stores.page");
jest.mock("../../items/items.page");
jest.mock("../../menu/menu.page");
jest.mock("../../details/details.page");

SignIn.mockImplementation(() => <div>MockPlaceholder</div>);
ShelvesPage.mockImplementation(() => <div>MockPlaceholder</div>);
StoresPage.mockImplementation(() => <div>MockPlaceholder</div>);
ItemsPage.mockImplementation(() => <div>MockPlaceholder</div>);
DetailsPage.mockImplementation(() => <div>MockPlaceholder</div>);
MenuPage.mockImplementation(() => <div>MockPlaceholder</div>);

const mockDispatch = jest.fn();

describe("Check Routing", () => {
  let tests = [
    { path: "InvalidRouteInvalidRoute", state: { error: false, login: true } },
    { path: Routes.signin, state: { error: false, login: false } },
    { path: Routes.shelves, state: { error: false, login: true } },
    { path: Routes.stores, state: { error: false, login: true } },
    { path: Routes.items, state: { error: false, login: true } },
    { path: Routes.details, state: { error: false, login: true } },
  ];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(
      <UserContext.Provider
        value={{ user: currentTest.state, dispatch: mockDispatch }}
      >
        <MemoryRouter initialEntries={[currentTest.path]}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the menu root page on a non matching url", async (done) => {
    expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
    await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
    await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
    await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
    await waitFor(() => expect(MenuPage).toBeCalledTimes(1));
    done();
  });

  it("should render signin on root url, with login set to false", async (done) => {
    expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
    await waitFor(() => expect(SignIn).toBeCalledTimes(1));
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
    await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
    await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
    await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
    await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
    done();
  });

  it("should render shelf on shelf url, with login set to true", async (done) => {
    expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(1));
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
    await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
    await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
    await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
    done();
  });

  it("should render stores on stores url, with login set to true", async (done) => {
    expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    await waitFor(() => expect(StoresPage).toBeCalledTimes(1));
    await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
    await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
    await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
    done();
  });

  it("should render items on items url, with login set to true", async (done) => {
    expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
    await waitFor(() => expect(ItemsPage).toBeCalledTimes(1));
    await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
    await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
    done();
  });

  it("should render details on items details url, with login set to true", async (done) => {
    expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
    await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
    await waitFor(() => expect(SignIn).toBeCalledTimes(0));
    await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
    await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
    await waitFor(() => expect(DetailsPage).toBeCalledTimes(1));
    await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
    done();
  });
});
