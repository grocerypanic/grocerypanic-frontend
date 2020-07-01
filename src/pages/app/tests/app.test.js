import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import App from "../app.js";
import SignIn from "../../signin/signin.container";
import About from "../../about/about.page";
import ShelvesPage from "../../shelves/shelves.page";
import StoresPage from "../../stores/stores.page";
import ItemsPage from "../../items/items.page";
import CreatePage from "../../create/create.page";
import DetailsPage from "../../details/details.page";
import MenuPage from "../../menu/menu.page";
import Header from "../../../components/header/header.component";

import { UserContext } from "../../../providers/user/user.provider";

import Routes from "../../../configuration/routes";

jest.mock("../../../providers/analytics/analytics.provider");

jest.mock("../../signin/signin.container");
jest.mock("../../shelves/shelves.page");
jest.mock("../../stores/stores.page");
jest.mock("../../items/items.page");
jest.mock("../../menu/menu.page");
jest.mock("../../details/details.page");
jest.mock("../../create/create.page");
jest.mock("../../about/about.page");
jest.mock("../../../components/header/header.component");

About.mockImplementation(() => <div>MockPlaceholderAboutPage</div>);
SignIn.mockImplementation(() => <div>MockPlaceholderSignin</div>);
ShelvesPage.mockImplementation(() => <div>MockPlaceholderShelvesPage</div>);
StoresPage.mockImplementation(() => <div>MockPlaceholderStoresPage</div>);
ItemsPage.mockImplementation(() => <div>MockPlaceholderItemsPage</div>);
DetailsPage.mockImplementation(() => <div>MockPlaceholderDetailsPage</div>);
MenuPage.mockImplementation(() => <div>MockPlaceholderMenuPage</div>);
CreatePage.mockImplementation(() => <div>MockPlaceholderCreatePage</div>);
Header.mockImplementation(() => <div>MockHeader</div>);

const mockDispatch = jest.fn();

describe("Check Routing", () => {
  let utils;
  let setup;
  const history = createBrowserHistory();

  beforeEach(() => {
    jest.clearAllMocks();
    setup = { state: { error: false } };
  });

  afterEach(cleanup);

  const renderHelper = (currentTest) => {
    history.push(setup.path);
    return render(
      <UserContext.Provider
        value={{ user: currentTest.state, dispatch: mockDispatch }}
      >
        <Router history={history}>
          <App />
        </Router>
      </UserContext.Provider>
    );
  };

  describe("root url", () => {
    beforeEach(() => (setup.path = Routes.root));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });
      it("should render menu on root url", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(1));
        expect(window.location.pathname).toBe(Routes.root);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on root url (from menu page)", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(1));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("invalid url", () => {
    beforeEach(() => (setup.path = "InvalidRouteInvalidRoute"));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });
      it("should render the menu root page", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(1));
        await waitFor(() => expect(window.location.pathname).toBe(Routes.root));
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on invalid url (from menu page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(1));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("stores url", () => {
    beforeEach(() => (setup.path = Routes.stores));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });

      it("should render stores on stores url, with login set to true", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(1));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.stores);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on stores url (from stores page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(1));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("shelves url", () => {
    beforeEach(() => (setup.path = Routes.shelves));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });

      it("should render shelves on shelves url, with login set to true", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(1));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.shelves);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on shelves url (from shelves page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(1));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("items url", () => {
    beforeEach(() => (setup.path = Routes.items));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });

      it("should render items on items url, with login set to true", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(1));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.items);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on items url (from items page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(1));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("details url", () => {
    beforeEach(() => (setup.path = Routes.details));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });

      it("should render details on details url, with login set to true", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(1));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.details);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on details url (from details page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(1));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("create url", () => {
    beforeEach(() => (setup.path = Routes.create));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });

      it("should render create on create url, with login set to true", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(1));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.create);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on create url (from create page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(0));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(1));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });

  describe("about url", () => {
    beforeEach(() => (setup.path = Routes.about));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });

      it("should render about on about url, with login set to true", async (done) => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await waitFor(() => expect(About).toBeCalledTimes(1));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(0));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.about);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on about url (from about page)", async (done) => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await waitFor(() => expect(About).toBeCalledTimes(1));
        await waitFor(() => expect(ShelvesPage).toBeCalledTimes(0));
        await waitFor(() => expect(SignIn).toBeCalledTimes(1));
        await waitFor(() => expect(StoresPage).toBeCalledTimes(0));
        await waitFor(() => expect(ItemsPage).toBeCalledTimes(0));
        await waitFor(() => expect(DetailsPage).toBeCalledTimes(0));
        await waitFor(() => expect(CreatePage).toBeCalledTimes(0));
        await waitFor(() => expect(MenuPage).toBeCalledTimes(0));
        expect(window.location.pathname).toBe(Routes.signin);
        done();
      });
      it("should render the header", () => {
        expect(Header).toBeCalledTimes(1);
      });
    });
  });
});
