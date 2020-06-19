import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import Header from "../header.component";

import * as bootstrap from "react-bootstrap";
import * as AddIcon from "@material-ui/icons/Add";
import * as HomeIcon from "@material-ui/icons/Home";
import * as StoreIcon from "@material-ui/icons/Store";
import * as KitchenIcon from "@material-ui/icons/Kitchen";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";

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

describe("during a transaction", () => {
  let utils;
  const create = jest.fn();
  const history = createBrowserHistory();
  history.location.pathname = "/some/unmatched/path";

  describe("with a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      utils = render(
        <Router history={history}>
          <Header create={create} transaction={true} />
        </Router>
      );
    });

    afterEach(cleanup);

    it("should show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.getByTestId("AddIcon")).toBeTruthy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title", () => {
      expect(utils.getByText(Strings.MainTitle)).toBeTruthy();
    });

    it("should call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(1);
    });

    it("should call the nav buttons", () => {
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should not navigate to home, when home is clicked", async (done) => {
      const home = utils.getByTestId("home-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to stores, when stores is clicked", async (done) => {
      const home = utils.getByTestId("stores-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to shelves, when shelves is clicked", async (done) => {
      const home = utils.getByTestId("shelves-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to about, when about is clicked", async (done) => {
      const home = utils.getByText(Strings.MainTitle);
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });
  });
  describe("without a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      utils = render(
        <Router history={history}>
          <Header transaction={true} />
        </Router>
      );
    });

    afterEach(cleanup);

    it("should not show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.queryByTestId("AddIcon")).toBeFalsy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title", () => {
      expect(utils.getByText(Strings.MainTitle)).toBeTruthy();
    });

    it("should call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(1);
    });

    it("should call the nav buttons", () => {
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should not navigate to home, when home is clicked", async (done) => {
      const home = utils.getByTestId("home-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to stores, when stores is clicked", async (done) => {
      const home = utils.getByTestId("stores-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to shelves, when shelves is clicked", async (done) => {
      const home = utils.getByTestId("shelves-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to about, when about is clicked", async (done) => {
      const home = utils.getByText(Strings.MainTitle);
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });
  });
});

describe("outside of a transaction", () => {
  let utils;
  const create = jest.fn();
  const history = createBrowserHistory();

  afterEach(cleanup);

  describe("with a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      utils = render(
        <Router history={history}>
          <Header create={create} transaction={false} />
        </Router>
      );
    });

    it("should show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.getByTestId("AddIcon")).toBeTruthy();
      expect(AddIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should render the title", () => {
      expect(utils.getByText(Strings.MainTitle)).toBeTruthy();
    });

    it("should not call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    });

    it("should call the nav buttons", () => {
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should navigate to about, when about is clicked", async (done) => {
      const home = utils.getByText(Strings.MainTitle);
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.about)
      );
      done();
    });

    it("should navigate to home, when home is clicked", async (done) => {
      const home = utils.getByTestId("home-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.root)
      );
      done();
    });

    it("should navigate to stores, when stores is clicked", async (done) => {
      const stores = utils.getByTestId("stores-icon");
      fireEvent.click(stores, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.stores)
      );
      done();
    });

    it("should navigate to shelves, when shelves is clicked", async (done) => {
      const shelves = utils.getByTestId("shelves-icon");
      fireEvent.click(shelves, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.shelves)
      );
      done();
    });

    it("should navigate to about, when about is clicked", async (done) => {
      const home = utils.getByText(Strings.MainTitle);
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.about)
      );
      done();
    });
  });

  describe("without a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      utils = render(
        <Router history={history}>
          <Header transaction={false} />
        </Router>
      );
    });

    afterEach(cleanup);

    it("should not show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeTruthy();
      expect(utils.queryByTestId("AddIcon")).toBeFalsy();
      expect(AddIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should render the title", () => {
      expect(utils.getByText(Strings.MainTitle)).toBeTruthy();
    });

    it("should not call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    });

    it("should call the nav buttons", () => {
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should not navigate to home, when home is clicked", async (done) => {
      const home = utils.getByTestId("home-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.root)
      );
      done();
    });

    it("should navigate to stores, when stores is clicked", async (done) => {
      const home = utils.getByTestId("stores-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.stores)
      );
      done();
    });

    it("should navigate to shelves, when shelves is clicked", async (done) => {
      const home = utils.getByTestId("shelves-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.shelves)
      );
      done();
    });

    it("should navigate to about, when about is clicked", async (done) => {
      const home = utils.getByText(Strings.MainTitle);
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.about)
      );
      done();
    });
  });
});
