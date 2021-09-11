import { render, waitFor } from "@testing-library/react";
import { createBrowserHistory } from "history";
import i18next from "i18next";
import React from "react";
import { Router } from "react-router-dom";
import Header from "../../../components/header/header.component";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import mockProfileHook from "../../../providers/api/user/tests/user.hook.mock";
import useProfile from "../../../providers/api/user/user.hook";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import { SocialContext } from "../../../providers/social/social.provider";
import About from "../../about/about.page";
import CreatePage from "../../create/create.page";
import DetailsPage from "../../details/details.page";
import ItemsPage from "../../items/items.page";
import MenuPage from "../../menu/menu.page";
import PrivacyPage from "../../privacy/privacy.page";
import ProfilePage from "../../profile/profile.page";
import ShelvesPage from "../../shelves/shelves.page";
import SignIn from "../../signin/signin.container";
import SplashPage from "../../splash/splash.page";
import StoresPage from "../../stores/stores.page";
import App from "../app.js";

jest.mock("../../../providers/analytics/analytics.provider");

jest.mock("../../signin/signin.container");
jest.mock("../../privacy/privacy.page");
jest.mock("../../profile/profile.page");
jest.mock("../../shelves/shelves.page");
jest.mock("../../stores/stores.page");
jest.mock("../../items/items.page");
jest.mock("../../menu/menu.page");
jest.mock("../../details/details.page");
jest.mock("../../create/create.page");
jest.mock("../../about/about.page");
jest.mock("../../splash/splash.page");
jest.mock("../../../components/header/header.component");
jest.mock("../../../providers/api/user/user.hook");

About.mockImplementation(() => <div>MockPlaceholderAboutPage</div>);
SignIn.mockImplementation(() => <div>MockPlaceholderSignin</div>);
PrivacyPage.mockImplementation(() => <div>MockPlaceholderPrivacyPage</div>);
ProfilePage.mockImplementation(() => <div>MockPlaceholderPrivacyPage</div>);
ShelvesPage.mockImplementation(() => <div>MockPlaceholderShelvesPage</div>);
StoresPage.mockImplementation(() => <div>MockPlaceholderStoresPage</div>);
ItemsPage.mockImplementation(() => <div>MockPlaceholderItemsPage</div>);
DetailsPage.mockImplementation(() => <div>MockPlaceholderDetailsPage</div>);
MenuPage.mockImplementation(() => <div>MockPlaceholderMenuPage</div>);
CreatePage.mockImplementation(() => <div>MockPlaceholderCreatePage</div>);
Header.mockImplementation(() => <div>MockHeader</div>);
SplashPage.mockImplementation(() => <div>MockSplashPage</div>);

const allPages = [
  About,
  SignIn,
  PrivacyPage,
  ProfilePage,
  ShelvesPage,
  StoresPage,
  ItemsPage,
  DetailsPage,
  MenuPage,
  CreatePage,
  SplashPage,
];

const currentProfile = mockProfileHook();
currentProfile.profile.user.inventory = [
  { id: 0, name: "mock user", has_profile_initialized: true },
];

const mockDispatch = jest.fn();
const mockHeaderUpdate = jest.fn();

describe("Check Routing", () => {
  let utils;
  let setup;
  const history = createBrowserHistory();

  beforeEach(() => {
    jest.clearAllMocks();
    setup = { state: { fail: false } };
  });

  const checkPages = async (calledPages) => {
    for (const page of calledPages) {
      await waitFor(() => expect(page).toBeCalledTimes(1));
    }
    for (const page of allPages) {
      if (calledPages.includes(page)) continue;
      await waitFor(() => expect(page).toBeCalledTimes(0));
    }
  };

  const renderHelper = (currentTest) => {
    useProfile.mockImplementation(() => currentProfile);
    history.push(setup.path);
    return render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <SocialContext.Provider
          value={{ socialLogin: currentTest.state, dispatch: mockDispatch }}
        >
          <Router history={history}>
            <App />
          </Router>
        </SocialContext.Provider>
      </HeaderContext.Provider>
    );
  };

  const checkHeader = () => {
    expect(Header).toBeCalledTimes(1);
    expect(mockHeaderUpdate).toBeCalledWith({
      title: "MainHeaderTitle",
      disableNav: true,
    });
    expect(i18next.t("MainHeaderTitle")).toBe(Strings.MainHeaderTitle);
  };

  describe("menu url", () => {
    beforeEach(() => (setup.path = Routes.menu));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });
      it("should render menu on menu url", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([MenuPage]);
        expect(window.location.pathname).toBe(Routes.menu);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on root url (from menu page)", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([MenuPage, SignIn]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
  });

  describe("profile url", () => {
    beforeEach(() => (setup.path = Routes.profile));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });
      it("should render profile on profile url", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([ProfilePage]);
        expect(window.location.pathname).toBe(Routes.profile);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on profile url", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([SignIn, ProfilePage]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render the menu root page", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([MenuPage]);
        await waitFor(() => expect(window.location.pathname).toBe(Routes.menu));
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to signin on invalid url (from menu page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([SignIn, MenuPage]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render stores on stores url, with login set to true", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([StoresPage]);
        expect(window.location.pathname).toBe(Routes.stores);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on stores url (from stores page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([SignIn, StoresPage]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render shelves on shelves url, with login set to true", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([ShelvesPage]);
        expect(window.location.pathname).toBe(Routes.shelves);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on shelves url (from shelves page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([SignIn, ShelvesPage]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render items on items url, with login set to true", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([ItemsPage]);
        expect(window.location.pathname).toBe(Routes.items);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on items url (from items page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([SignIn, ItemsPage]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render details on details url, with login set to true", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([DetailsPage]);
        expect(window.location.pathname).toBe(Routes.details);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on details url (from details page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([DetailsPage, SignIn]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render create on create url, with login set to true", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([CreatePage]);
        expect(window.location.pathname).toBe(Routes.create);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on create url (from create page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([CreatePage, SignIn]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
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

      it("should render about on about url, with login set to true", async () => {
        expect(utils.getByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([About]);
        expect(window.location.pathname).toBe(Routes.about);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });

    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });

      it("should redirect to signin on about url (from about page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([About, SignIn]);
        expect(window.location.pathname).toBe(Routes.signin);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
  });

  describe("splash url", () => {
    beforeEach(() => (setup.path = Routes.splash));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = true;
        utils = renderHelper({ ...setup });
      });
      it("should redirect to menu on splash url (from splash page)", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([MenuPage]);
        expect(window.location.pathname).toBe(Routes.menu);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should render splash page on splash url", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([SplashPage]);
        expect(window.location.pathname).toBe(Routes.splash);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
  });

  describe("privacy url", () => {
    beforeEach(() => (setup.path = Routes.privacy));
    describe("active login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should render the privacy policy page", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeTruthy();
        await checkPages([PrivacyPage]);
        expect(window.location.pathname).toBe(Routes.privacy);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
    describe("inactive login", () => {
      beforeEach(() => {
        setup.state.login = false;
        utils = renderHelper({ ...setup });
      });
      it("should render the privacy policy page", async () => {
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        await checkPages([PrivacyPage]);
        expect(window.location.pathname).toBe(Routes.privacy);
      });
      it("should configure the header properly", () => {
        checkHeader();
      });
    });
  });
});
