import * as AddIcon from "@material-ui/icons/Add";
import * as FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import * as HomeIcon from "@material-ui/icons/Home";
import * as InfoIcon from "@material-ui/icons/Info";
import * as KitchenIcon from "@material-ui/icons/Kitchen";
import * as LockOpenIcon from "@material-ui/icons/LockOpen";
import * as StoreIcon from "@material-ui/icons/Store";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import * as bootstrap from "react-bootstrap";
import { Router } from "react-router-dom";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import { HeaderContext } from "../../../providers/header/header.provider";
import Header from "../header.component";

const mockHeaderUpdate = jest.fn();
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
jest.mock("@material-ui/icons/LockOpen", () => ({
  __esModule: true,
  default: jest.fn(),
}));
LockOpenIcon.default.mockImplementation(() => <div>MockLockOpen</div>);

const mockTitle = "A Very Real Title";
const mockCreate = jest.fn();

const renderHelper = (headerValues, history) => {
  return render(
    <HeaderContext.Provider value={headerValues}>
      <Router history={history}>
        <Header />
      </Router>
    </HeaderContext.Provider>
  );
};

describe("with nav enabled", () => {
  describe("during a transaction", () => {
    let utils;
    const history = createBrowserHistory();
    history.location.pathname = "/some/unmatched/path";
    let disableNav = false;

    describe("with a create function", () => {
      beforeEach(() => {
        history.location.pathname = "/some/unmatched/path";
        jest.clearAllMocks();
        const values = {
          headerSettings: {
            title: mockTitle,
            create: mockCreate,
            transaction: true,
            disableNav,
          },
          updateHeader: mockHeaderUpdate,
        };
        utils = renderHelper(values, history);
      });

      afterEach(cleanup);

      it("should show the create button", () => {
        expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
        expect(utils.getByTestId("AddIcon")).toBeTruthy();
        expect(AddIcon.default).toHaveBeenCalledTimes(0);
      });

      it("should render the title correctly in mobile mode", async () => {
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
      });

      it("should render the title correctly in desktop mode", async () => {
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

      it("should render the nav buttons correctly in mobile mode", async () => {
        window.innerWidth = 380;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action fit nav-item")
        );
      });

      it("should render the nav buttons correctly in desktop mode", async () => {
        window.innerWidth = 680;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action nav-item")
        );
      });

      it("should not navigate to about, when title is clicked", async () => {
        const title = utils.getByText(Strings.MainTitle);
        fireEvent.click(title, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to about, when info is clicked", async () => {
        const home = utils.getByTestId("info-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to home, when home is clicked", async () => {
        const home = utils.getByTestId("home-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to stores, when stores is clicked", async () => {
        const home = utils.getByTestId("stores-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to shelves, when shelves is clicked", async () => {
        const home = utils.getByTestId("shelves-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to items, when the list icon is clicked", async () => {
        const inventory = utils.getByTestId("list-icon");
        fireEvent.click(inventory, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("without a create function", () => {
      beforeEach(() => {
        history.location.pathname = "/some/unmatched/path";
        jest.clearAllMocks();
        const values = {
          headerSettings: {
            title: mockTitle,
            create: null,
            transaction: true,
            disableNav,
          },
          updateHeader: mockHeaderUpdate,
        };
        utils = renderHelper(values, history);
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

      it("should render the nav buttons correctly in mobile mode", async () => {
        window.innerWidth = 380;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action fit nav-item")
        );
      });

      it("should render the nav buttons correctly in desktop mode", async () => {
        window.innerWidth = 680;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action nav-item")
        );
      });

      it("should not navigate to about, when title is clicked", async () => {
        const title = utils.getByText(Strings.MainTitle);
        fireEvent.click(title, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to about, when info is clicked", async () => {
        const home = utils.getByTestId("info-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to home, when home is clicked", async () => {
        const home = utils.getByTestId("home-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to stores, when stores is clicked", async () => {
        const home = utils.getByTestId("stores-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to shelves, when shelves is clicked", async () => {
        const home = utils.getByTestId("shelves-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should not navigate to items, when the list icon is clicked", async () => {
        const inventory = utils.getByTestId("list-icon");
        fireEvent.click(inventory, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual("/some/unmatched/path")
        );
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe("outside of a transaction", () => {
    let utils;
    const history = createBrowserHistory();

    afterEach(cleanup);

    describe("with a create function", () => {
      beforeEach(() => {
        history.location.pathname = "/some/unmatched/path";
        jest.clearAllMocks();
        const values = {
          headerSettings: {
            title: mockTitle,
            create: mockCreate,
            transaction: false,
            disableNav: false,
          },
          updateHeader: mockHeaderUpdate,
        };
        utils = renderHelper(values, history);
      });

      it("should show the create button", () => {
        expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
        expect(utils.getByTestId("AddIcon")).toBeTruthy();
        expect(AddIcon.default).toHaveBeenCalledTimes(1);
      });

      it("should render the title correctly in mobile mode", async () => {
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
      });

      it("should render the title correctly in desktop mode", async () => {
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

      it("should render the nav buttons correctly in mobile mode", async () => {
        window.innerWidth = 380;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action fit nav-item")
        );
      });

      it("should render the nav buttons correctly in desktop mode", async () => {
        window.innerWidth = 680;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action nav-item")
        );
      });

      it("should navigate to about, when title is clicked", async () => {
        const title = utils.getByText(Strings.MainTitle);
        fireEvent.click(title, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.about)
        );
      });

      it("should navigate to about, when info is clicked", async () => {
        const info = utils.getByTestId("info-icon");
        fireEvent.click(info, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.about)
        );
      });

      it("should navigate to home, when home is clicked", async () => {
        const home = utils.getByTestId("home-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.menu)
        );
      });

      it("should navigate to stores, when stores is clicked", async () => {
        const stores = utils.getByTestId("stores-icon");
        fireEvent.click(stores, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.stores)
        );
      });

      it("should navigate to shelves, when shelves is clicked", async () => {
        const shelves = utils.getByTestId("shelves-icon");
        fireEvent.click(shelves, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.shelves)
        );
      });

      it("should navigate to items, when the list is clicked, and the current url has a search param", async () => {
        history.location.search = "?color=blue";
        const inventory = utils.getByTestId("list-icon");
        fireEvent.click(inventory, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.items)
        );
      });

      it("should not navigate to items, when the list is clicked, and the current url has no search params", async () => {
        history.location.pathname = Routes.items;
        const oldKey = history.location.key;
        const inventory = utils.getByTestId("list-icon");
        fireEvent.click(inventory, "click");
        await waitFor(() => expect(history.location.key).toEqual(oldKey));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("without a create function", () => {
      beforeEach(() => {
        history.location.pathname = "/some/unmatched/path";
        jest.clearAllMocks();
        const values = {
          headerSettings: {
            title: mockTitle,
            create: null,
            transaction: false,
            disableNav: false,
          },
          updateHeader: mockHeaderUpdate,
        };
        utils = renderHelper(values, history);
      });

      afterEach(cleanup);

      it("should not show the create button", () => {
        expect(utils.queryByTestId("noAddIcon")).toBeTruthy();
        expect(utils.queryByTestId("AddIcon")).toBeFalsy();
        expect(AddIcon.default).toHaveBeenCalledTimes(1);
      });

      it("should render the title correctly in mobile mode", async () => {
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
      });

      it("should render the title correctly in desktop mode", async () => {
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

      it("should render the nav buttons correctly in mobile mode", async () => {
        window.innerWidth = 380;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action fit nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action fit nav-item")
        );
      });

      it("should render the nav buttons correctly in desktop mode", async () => {
        window.innerWidth = 680;
        fireEvent(window, new Event("resize"));
        await waitFor(() =>
          expect(utils.getByTestId("list-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("info-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("home-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(utils.getByTestId("stores-icon").parentElement.className).toBe(
            "nav-link action nav-item"
          )
        );
        await waitFor(() =>
          expect(
            utils.getByTestId("shelves-icon").parentElement.className
          ).toBe("nav-link action nav-item")
        );
      });

      it("should navigate to about, when title is clicked", async () => {
        const title = utils.getByText(Strings.MainTitle);
        fireEvent.click(title, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.about)
        );
      });

      it("should navigate to about, when info is clicked", async () => {
        const info = utils.getByTestId("info-icon");
        fireEvent.click(info, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.about)
        );
      });

      it("should navigate to home, when home is clicked", async () => {
        const home = utils.getByTestId("home-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.menu)
        );
      });

      it("should navigate to stores, when stores is clicked", async () => {
        const home = utils.getByTestId("stores-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.stores)
        );
      });

      it("should navigate to shelves, when shelves is clicked", async () => {
        const home = utils.getByTestId("shelves-icon");
        fireEvent.click(home, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.shelves)
        );
      });

      it("should navigate to items, when the list is clicked", async () => {
        const inventory = utils.getByTestId("list-icon");
        fireEvent.click(inventory, "click");
        await waitFor(() =>
          expect(history.location.pathname).toEqual(Routes.items)
        );
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });
});

describe("with nav disabled", () => {
  let utils;
  const history = createBrowserHistory();
  let disableNav = true;

  afterEach(cleanup);

  describe("with a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      const values = {
        headerSettings: {
          title: mockTitle,
          create: mockCreate,
          transaction: false,
          disableNav,
        },
        updateHeader: mockHeaderUpdate,
      };
      utils = renderHelper(values, history);
    });

    it("should not show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.queryByTestId("AddIcon")).toBeFalsy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title correctly in mobile mode", async () => {
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
    });

    it("should render the title correctly in desktop mode", async () => {
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
    });

    it("should not call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    });

    it("should not call the nav buttons", () => {
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(0);
      expect(InfoIcon.default).toHaveBeenCalledTimes(0);
      expect(HomeIcon.default).toHaveBeenCalledTimes(0);
      expect(StoreIcon.default).toHaveBeenCalledTimes(0);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should not navigate to about, when title is clicked", async () => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });

  describe("without a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      const values = {
        headerSettings: {
          title: mockTitle,
          create: null,
          transaction: false,
          disableNav,
        },
        updateHeader: mockHeaderUpdate,
      };
      utils = renderHelper(values, history);
    });

    it("should not show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.queryByTestId("AddIcon")).toBeFalsy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title correctly in mobile mode", async () => {
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
    });

    it("should render the title correctly in desktop mode", async () => {
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
    });

    it("should not call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    });

    it("should not call the nav buttons", () => {
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(0);
      expect(InfoIcon.default).toHaveBeenCalledTimes(0);
      expect(HomeIcon.default).toHaveBeenCalledTimes(0);
      expect(StoreIcon.default).toHaveBeenCalledTimes(0);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should not navigate to about, when title is clicked", async () => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("with signin enabled", () => {
  let utils;
  const history = createBrowserHistory();
  let signIn = true;

  afterEach(cleanup);

  describe("with a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      const values = {
        headerSettings: {
          title: mockTitle,
          create: mockCreate,
          transaction: false,
          signIn,
        },
        updateHeader: mockHeaderUpdate,
      };
      utils = renderHelper(values, history);
    });

    it("should show the signin button", () => {
      expect(utils.queryByTestId("signIn")).toBeTruthy();
      expect(LockOpenIcon.default).toHaveBeenCalledTimes(1);
      expect(utils.getByText(Strings.SplashPage.SignIn));
    });

    it("should navigate to signin, when signin is clicked", async () => {
      const signin = utils.getByText(Strings.SplashPage.SignIn);
      fireEvent.click(signin, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.signin)
      );
    });

    it("should not show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.queryByTestId("AddIcon")).toBeFalsy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title correctly in mobile mode", async () => {
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
    });

    it("should render the title correctly in desktop mode", async () => {
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
    });

    it("should not call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    });

    it("should not call the nav buttons", () => {
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(0);
      expect(InfoIcon.default).toHaveBeenCalledTimes(0);
      expect(HomeIcon.default).toHaveBeenCalledTimes(0);
      expect(StoreIcon.default).toHaveBeenCalledTimes(0);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should not navigate to about, when title is clicked", async () => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });

  describe("without a create function", () => {
    beforeEach(() => {
      history.location.pathname = "/some/unmatched/path";
      jest.clearAllMocks();
      const values = {
        headerSettings: {
          title: mockTitle,
          create: null,
          transaction: false,
          signIn,
        },
        updateHeader: mockHeaderUpdate,
      };
      utils = renderHelper(values, history);
    });

    it("should show the signin button", () => {
      expect(utils.queryByTestId("signIn")).toBeTruthy();
      expect(LockOpenIcon.default).toHaveBeenCalledTimes(1);
      expect(utils.getByText(Strings.SplashPage.SignIn));
    });

    it("should navigate to signin, when signin is clicked", async () => {
      const signin = utils.getByText(Strings.SplashPage.SignIn);
      fireEvent.click(signin, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual(Routes.signin)
      );
    });

    it("should not show the create button", () => {
      expect(utils.queryByTestId("noAddIcon")).toBeFalsy();
      expect(utils.queryByTestId("AddIcon")).toBeFalsy();
      expect(AddIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should render the title correctly in mobile mode", async () => {
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
    });

    it("should render the title correctly in desktop mode", async () => {
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
    });

    it("should not call the spinner", () => {
      expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    });

    it("should not call the nav buttons", () => {
      expect(FormatListNumbered.default).toHaveBeenCalledTimes(0);
      expect(InfoIcon.default).toHaveBeenCalledTimes(0);
      expect(HomeIcon.default).toHaveBeenCalledTimes(0);
      expect(StoreIcon.default).toHaveBeenCalledTimes(0);
      expect(KitchenIcon.default).toHaveBeenCalledTimes(0);
    });

    it("should not navigate to about, when title is clicked", async () => {
      const title = utils.getByText(Strings.MainTitle);
      fireEvent.click(title, "click");
      await waitFor(() =>
        expect(history.location.pathname).toEqual("/some/unmatched/path")
      );
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });
});
