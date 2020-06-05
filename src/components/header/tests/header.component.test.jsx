import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";

import { Router, MemoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import Header from "../header.component";

import * as StopIcon from "@material-ui/icons/Stop";
import * as bootstrap from "react-bootstrap";
import * as AddIcon from "@material-ui/icons/Add";
import * as HomeIcon from "@material-ui/icons/Home";
import * as StoreIcon from "@material-ui/icons/Store";
import * as KitchenIcon from "@material-ui/icons/Kitchen";

import Routes from "../../../configuration/routes";

jest.unmock("react-bootstrap");
bootstrap.Spinner = jest.fn();
bootstrap.Spinner.mockImplementation(() => <div>MockSpinner</div>);

jest.mock("@material-ui/icons/Add", () => ({
  __esModule: true,
  default: jest.fn(),
}));
AddIcon.default.mockImplementation(() => <div>MockCreate</div>);
jest.mock("@material-ui/icons/Home", () => ({
  __esModule: true,
  default: jest.fn(),
}));
HomeIcon.default.mockImplementation(() => <div>MockCreate</div>);
jest.mock("@material-ui/icons/Store", () => ({
  __esModule: true,
  default: jest.fn(),
}));
StoreIcon.default.mockImplementation(() => <div>MockCreate</div>);
jest.mock("@material-ui/icons/Kitchen", () => ({
  __esModule: true,
  default: jest.fn(),
}));
KitchenIcon.default.mockImplementation(() => <div>MockCreate</div>);
jest.mock("@material-ui/icons/Stop", () => ({
  __esModule: true,
  default: jest.fn(),
}));
StopIcon.default.mockImplementation(() => <div>MockCreate</div>);

describe("Setup Environment", () => {
  let tests = [{ transaction: true }, { transaction: false }];
  let utils;
  let currentTest;
  const create = jest.fn();

  beforeEach(() => {
    currentTest = tests.shift();
    jest.clearAllMocks();
    utils = render(
      <MemoryRouter>
        <Header
          title="Some Title"
          create={create}
          transaction={currentTest.transaction}
        />
      </MemoryRouter>
    );
  });

  afterEach(cleanup);

  it("should render title, icons, and a spinner during a transaction", () => {
    expect(currentTest.transaction).toBe(true);
    expect(utils.getByText("Panic: Some Title")).toBeTruthy();
    expect(bootstrap.Spinner).toHaveBeenCalledTimes(1);
    expect(AddIcon.default).toHaveBeenCalledTimes(0);
    expect(StopIcon.default).toHaveBeenCalledTimes(0);

    expect(HomeIcon.default).toHaveBeenCalledTimes(1);
    expect(StoreIcon.default).toHaveBeenCalledTimes(1);
    expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
  });

  it("should render title, icons, and the create button outside of transactions", () => {
    expect(currentTest.transaction).toBe(false);
    expect(utils.getByText("Panic: Some Title")).toBeTruthy();
    expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    expect(AddIcon.default).toHaveBeenCalledTimes(1);
    expect(StopIcon.default).toHaveBeenCalledTimes(0);

    expect(HomeIcon.default).toHaveBeenCalledTimes(1);
    expect(StoreIcon.default).toHaveBeenCalledTimes(1);
    expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
  });
});

describe("Setup Environment, no create button, no spinner, no transaction", () => {
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    utils = render(
      <MemoryRouter>
        <Header title="Some Title" transaction={false} />
      </MemoryRouter>
    );
  });

  afterEach(cleanup);

  it("should render title, icons, but no add button", () => {
    expect(utils.getByText("Panic: Some Title")).toBeTruthy();
    expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    expect(AddIcon.default).toHaveBeenCalledTimes(0);
    expect(StopIcon.default).toHaveBeenCalledTimes(1);

    expect(HomeIcon.default).toHaveBeenCalledTimes(1);
    expect(StoreIcon.default).toHaveBeenCalledTimes(1);
    expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
  });
});

describe("during a transaction", () => {
  let utils;
  const create = jest.fn();
  const history = createBrowserHistory();
  history.location.pathname = "/some/unmatched/path";

  beforeEach(() => {
    utils = render(
      <Router history={history}>
        <Header title="Some Title" create={create} transaction={true} />
      </Router>
    );
  });

  afterEach(cleanup);

  it("should not navigate to home, when home is clicked", async (done) => {
    const home = utils.getByTestId("home-icon");
    fireEvent.click(home, "click");
    await waitFor(() =>
      expect(history.location.pathname).toEqual("/some/unmatched/path")
    );
    done();
  });

  it("should navigate to stores, when stores is clicked", async (done) => {
    const home = utils.getByTestId("stores-icon");
    fireEvent.click(home, "click");
    await waitFor(() =>
      expect(history.location.pathname).toEqual("/some/unmatched/path")
    );
    done();
  });

  it("should navigate to shelves, when shelves is clicked", async (done) => {
    const home = utils.getByTestId("home-icon");
    fireEvent.click(home, "click");
    await waitFor(() =>
      expect(history.location.pathname).toEqual("/some/unmatched/path")
    );
    done();
  });
});

describe("outside a transaction", () => {
  let utils2;
  const create = jest.fn();
  const history = createBrowserHistory();
  beforeEach(() => {
    history.location.pathname = "/some/unmatched/path";
    jest.clearAllMocks();
    utils2 = render(
      <Router history={history}>
        <Header title="Some OtherTitle" create={create} transaction={false} />
      </Router>
    );
  });

  afterEach(cleanup);

  it("should navigate to home, when home is clicked", async (done) => {
    const home = utils2.getByTestId("home-icon");
    fireEvent.click(home, "click");
    await waitFor(() => expect(history.location.pathname).toEqual(Routes.root));
    done();
  });

  it("should navigate to stores, when stores is clicked", async (done) => {
    const stores = utils2.getByTestId("stores-icon");
    fireEvent.click(stores, "click");
    await waitFor(() =>
      expect(history.location.pathname).toEqual(Routes.stores)
    );
    done();
  });

  it("should navigate to shelves, when shelves is clicked", async (done) => {
    const shelves = utils2.getByTestId("shelves-icon");
    fireEvent.click(shelves, "click");
    await waitFor(() =>
      expect(history.location.pathname).toEqual(Routes.shelves)
    );
    done();
  });
});
