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
import * as InfoIcon from "@material-ui/icons/Info";
import * as FormatListNumbered from "@material-ui/icons/FormatListNumbered";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";

jest.unmock("react-bootstrap");
bootstrap.Spinner = jest.fn();
bootstrap.Spinner.mockImplementation(() => <div>MockSpinner</div>);

jest.mock("@material-ui/icons/Add", () => ({
  __esModule: true,
  default: jest.fn(),
}));
AddIcon.default.mockImplementation(() => <div>MockAdd</div>);
jest.mock("@material-ui/icons/Home", () => ({
  __esModule: true,
  default: jest.fn(),
}));
HomeIcon.default.mockImplementation(() => <div>MockHome</div>);
jest.mock("@material-ui/icons/Info", () => ({
  __esModule: true,
  default: jest.fn(),
}));
InfoIcon.default.mockImplementation(() => <div>MockInfo</div>);
jest.mock("@material-ui/icons/Store", () => ({
  __esModule: true,
  default: jest.fn(),
}));
StoreIcon.default.mockImplementation(() => <div>MockStore</div>);
jest.mock("@material-ui/icons/Kitchen", () => ({
  __esModule: true,
  default: jest.fn(),
}));
KitchenIcon.default.mockImplementation(() => <div>MockKitchen</div>);
jest.mock("@material-ui/icons/FormatListNumbered", () => ({
  __esModule: true,
  default: jest.fn(),
}));
FormatListNumbered.default.mockImplementation(() => (
  <div>MockFormatListNumbered</div>
));

describe("during a transaction", () => {
  let utils;
  const create = jest.fn();
  const history = createBrowserHistory();
  history.location.pathname = "/some/unmatched/path";
  const mockTitle = "A Very Real Title";

  describe("with a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      utils = render(
        <Router history={history}>
          <Header title={mockTitle} create={create} transaction={true} />
        </Router>
      );
    });

    afterEach(cleanup);

    it("should show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.getByTestId("AddIcon")).toBeTruthy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title correctly in mobile mode", async (done) => {
      window.innerWidth = 380;
      fireEvent(window, new Event("resize"));
      await waitFor(() =>
        expect(utils.getByText(Strings.MainTitle).className).toBe(
          "header-visible"
        )
      );
      await waitFor(() =>
        expect(
          utils.getByText(`${Strings.MainTitle}: ${mockTitle}`).className
        ).toBe("header-hidden")
      );
      done();
    });

    it("should render the title correctly in desktop mode", async (done) => {
      window.innerWidth = 680;
      fireEvent(window, new Event("resize"));
      await waitFor(() =>
        expect(utils.getByText(Strings.MainTitle).className).toBe(
          "header-hidden"
        )
      );
      await waitFor(() =>
        expect(
          utils.getByText(`${Strings.MainTitle}: ${mockTitle}`).className
        ).toBe("header-visible")
      );
      done();
    });

    it("should call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(1);
    });

    it("should call the nav buttons", () => {
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(1);
      expect(InfoIcon.default).toHaveBeenCalledTimes(1);
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should not navigate to about, when title is clicked", async (done) => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to about, when info is clicked", async (done) => {
      const home = utils.getByTestId("info-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
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

    it("should not navigate to items, when the list icon is clicked", async (done) => {
      const inventory = utils.getByTestId("list-icon");
      fireEvent.click(inventory, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
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
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(1);
      expect(InfoIcon.default).toHaveBeenCalledTimes(1);
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should not navigate to about, when title is clicked", async (done) => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should not navigate to about, when info is clicked", async (done) => {
      const home = utils.getByTestId("info-icon");
      fireEvent.click(home, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
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

    it("should not navigate to items, when the list icon is clicked", async (done) => {
      const inventory = utils.getByTestId("list-icon");
      fireEvent.click(inventory, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
      done();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
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
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(1);
      expect(InfoIcon.default).toHaveBeenCalledTimes(1);
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should navigate to about, when title is clicked", async (done) => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.about)
      );
      done();
    });

    it("should navigate to about, when info is clicked", async (done) => {
      const info = utils.getByTestId("info-icon");
      fireEvent.click(info, "click");
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

    it("should navigate to items, when the list is clicked", async (done) => {
      const inventory = utils.getByTestId("list-icon");
      fireEvent.click(inventory, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.items)
      );
      done();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
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
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(1);
      expect(InfoIcon.default).toHaveBeenCalledTimes(1);
      expect(HomeIcon.default).toHaveBeenCalledTimes(1);
      expect(StoreIcon.default).toHaveBeenCalledTimes(1);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(1);
    });

    it("should navigate to about, when title is clicked", async (done) => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.about)
      );
      done();
    });

    it("should navigate to about, when info is clicked", async (done) => {
      const info = utils.getByTestId("info-icon");
      fireEvent.click(info, "click");
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

    it("should navigate to items, when the list is clicked", async (done) => {
      const inventory = utils.getByTestId("list-icon");
      fireEvent.click(inventory, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.items)
      );
      done();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });
});
