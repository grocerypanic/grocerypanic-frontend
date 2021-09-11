import { render, waitFor } from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { Router, Route } from "react-router-dom";
import Routes from "../../../configuration/routes";
import Profile from "../../../pages/profile/profile.page";
import mockProfileHook from "../../../providers/api/user/tests/user.hook.mock";
import useProfile from "../../../providers/api/user/user.hook";
import useSocialLogin from "../../../providers/social/social.hook";
import initialState from "../../../providers/social/social.initial";
import mockSocialHook from "../../../providers/social/tests/social.hook.mock";
import MockComponent, {
  MockComponentContents,
} from "../../../test.fixtures/mockComponent";
import { propCount } from "../../../test.fixtures/objectComparison";
import ProtectedRoute from "../protected-route.component";

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

let initialProps = {
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
  let currentProps;
  beforeEach(() => {
    jest.clearAllMocks();
    currentSocialHook = mockSocialHook();
    currentProfileHook = mockProfileHook();
    currentProps = { ...initialProps };
  });

  describe("When the route is operating in NEGATIVE match mode", () => {
    beforeEach(() => {
      currentProps.negative = true;
    });
    describe("When the route check does not match (login), and a profile is required", () => {
      describe("when the user profile is initialized", () => {
        beforeEach(() => {
          currentProps.history.push("/");
          currentProps.attr = "login";
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not initialized", () => {
        beforeEach(() => {
          currentProps.history.push("/");
          currentProps.attr = "login";
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProps.history.push("/");
          currentProps.attr = "login";
          currentProfileHook.profile.user.inventory = [];
          const state = { ...initialState, login: true };
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });
    });

    describe("When the route check does not match (login), and it does not require a user profile", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "login";
        currentProps.noProfile = true;
        state = { ...initialState, login: true };
      });

      describe("when the user profile is initialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not initialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });
    });

    describe("When the route check matches (login), and a profile is required", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "login";
        state = { ...initialState, login: false };
      });

      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);

          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);

          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);

          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });
    });

    describe("When the route check matches (login), and it does not require a user profile", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "login";
        currentProps.noProfile = true;
        state = { ...initialState, login: false };
      });

      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);

          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);

          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);

          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });
    });
  });

  describe("When the route operating in POSITIVE match mode", () => {
    beforeEach(() => {
      currentProps.negative = false;
    });
    describe("When the route check is not matching (error), and a profile is required", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "error";
        state = { ...initialState, error: false };
      });
      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not initialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the profile component", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          await waitFor(() => expect(Profile).toBeCalledTimes(1));
        });
      });
    });

    describe("When the route check is not matching (error), and it does not require a user profile", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "error";
        currentProps.noProfile = true;
        state = { ...initialState, error: false };
      });
      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not initialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should render the component as expected", async () => {
          expect(Route).toHaveBeenCalledTimes(1);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.root);

          expect(Profile).toBeCalledTimes(0);
        });
      });
    });

    describe("When the route check is matching (error), and a profile is required", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "error";
        state = { ...initialState, error: true };
      });

      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });
    });

    describe("When the route check is matching (error), and it does not require a user profile", () => {
      let state;
      beforeEach(() => {
        currentProps.history.push("/");
        currentProps.attr = "error";
        currentProps.noProfile = true;
        state = { ...initialState, error: true };
      });

      describe("when the user profile is intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: true },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is not intialized", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [
            { id: 0, name: "mock user", has_profile_initialized: false },
          ];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });

      describe("when the user profile is missing", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          render(<RenderFunction state={state} {...currentProps} />);
        });

        it("should redirect as expected", () => {
          expect(Route).toHaveBeenCalledTimes(2);
          const call = Route.mock.calls[0][0];
          propCount(call, 6);

          expect(call.component).toBe(MockComponent);
          expect(call.exact).toBeTruthy();
          expect(call.path).toBe("/");
          expect(call.location).not.toBe(currentProps.history.location);
          expect(call.staticContext).toBe(undefined);
          expect(currentProps.history.location.pathname).toBe(Routes.shelves);

          expect(Profile).toBeCalledTimes(0);
        });
      });
    });
  });
});
