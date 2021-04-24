import React from "react";
import { render, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import ProtectedRoute from "../protected-route.component";
import MockComponent, {
  MockComponentContents,
} from "../../../test.fixtures/mockComponent";

import initialState from "../../../providers/social/social.initial";

import useProfile from "../../../providers/api/user/user.hook";
import useSocialLogin from "../../../providers/social/social.hook";

import mockSocialHook from "../../../providers/social/tests/social.hook.mock";
import mockProfileHook from "../../../providers/api/user/tests/user.hook.mock";

import Routes from "../../../configuration/routes";
import Profile from "../../../pages/profile/profile.page";

jest.mock("../../../providers/social/social.hook");
jest.mock("../../../providers/api/user/user.hook");

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  Route: jest.fn(),
}));
jest.mock("../../../pages/profile/profile.page");
Route.mockImplementation(() => MockComponentContents);
Profile.mockImplementation(() => MockComponentContents);

let currentSocialHook;
let currentProfileHook;

let call;
let currentTest = {
  negative: false,
  exact: true,
  component: MockComponent,
  attr: "login",
  redirect: Routes.shelves,
  path: "/",
  history: createBrowserHistory({ basename: Routes.root }),
};

const RenderFunction = ({ state, history, ...otherProps }) => {
  currentSocialHook.social.socialLogin = state;
  useSocialLogin.mockImplementation(() => currentSocialHook);
  useProfile.mockImplementation(() => currentProfileHook);
  return (
    <Router history={history}>
      <ProtectedRoute {...otherProps} />
    </Router>
  );
};

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentSocialHook = mockSocialHook();
    currentProfileHook = mockProfileHook();
  });

  describe("When the route is matching negative", () => {
    beforeEach(() => {
      currentTest.negative = true;
    });
    describe("When the route is not matching login", () => {
      describe("when the user profile is initialized", () => {
        beforeEach(() => {
          currentTest.history.push("/");
          currentTest.attr = "login";
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentTest} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentTest.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentTest.history.location.pathname).toBe(Routes.root);
        });
      });

      describe("when the user profile is not initialized", () => {
        beforeEach(() => {
          currentTest.history.push("/");
          currentTest.attr = "login";
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentTest} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentTest.history.push("/");
          currentTest.attr = "login";
          currentProfileHook.profile.user.inventory = [];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentTest} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });
    });
    describe("When the route is matching login", () => {
      beforeEach(() => {
        currentTest.history.push("/");
        currentTest.attr = "login";
        const state = { ...initialState, login: false };
        render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should redirect as expected", () => {
        expect(Route).toHaveBeenCalledTimes(1);

        call = Route.mock.calls[0][0];
        propCount(call, 6);

        expect(call.component).toBe(MockComponent);
        expect(call.exact).toBeTruthy();
        expect(call.path).toBe("/");
        expect(call.location).not.toBe(currentTest.history.location);
        expect(call.staticContext).toBe(undefined);
        expect(currentTest.history.location.pathname).toBe(Routes.shelves);
      });
    });
  });

  describe("When the route matching positive", () => {
    beforeEach(() => {
      currentTest.negative = false;
    });
    describe("When the route is not matching error", () => {
      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentTest.history.push("/");
          currentTest.attr = "error";
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          const state = { ...initialState, error: false };
          render(<RenderFunction state={state} {...currentTest} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentTest.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentTest.history.location.pathname).toBe(Routes.root);
        });
      });

      describe("when the user profile is not intialized", () => {
        beforeEach(() => {
          currentTest.history.push("/");
          currentTest.attr = "error";
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          const state = { ...initialState, error: false };
          render(<RenderFunction state={state} {...currentTest} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentTest.history.push("/");
          currentTest.attr = "login";
          currentProfileHook.profile.user.inventory = [];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentTest} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });
    });
    describe("When the route is matching error", () => {
      beforeEach(() => {
        currentTest.history.push("/");
        currentTest.attr = "error";
        const state = { ...initialState, error: true };
        render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should redirect as expected", () => {
        expect(Route).toHaveBeenCalledTimes(1);
        call = Route.mock.calls[0][0];
        propCount(call, 6);

        expect(call.component).toBe(MockComponent);
        expect(call.exact).toBeTruthy();
        expect(call.path).toBe("/");
        expect(call.location).not.toBe(currentTest.history.location);
        expect(call.staticContext).toBe(undefined);
        expect(currentTest.history.location.pathname).toBe(Routes.shelves);
      });
    });
  });
});
