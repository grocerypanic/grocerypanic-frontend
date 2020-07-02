import React from "react";
import { render, cleanup } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import ProtectedRoute from "../protected-route.component";
import MockComponent, {
  MockComponentContents,
} from "../../../test.fixtures/mockComponent";

import { UserContext } from "../../../providers/user/user.provider";
import initialState from "../../../providers/user/user.initial";

import Routes from "../../../configuration/routes";

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  Route: jest.fn(),
}));
const mockDispatch = jest.fn();
Route.mockImplementation(() => MockComponentContents);

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
  return (
    <UserContext.Provider value={{ user: state, dispatch: mockDispatch }}>
      <Router history={history}>
        <ProtectedRoute {...otherProps} />
      </Router>
    </UserContext.Provider>
  );
};

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("When the route is matching negative", () => {
    beforeEach(() => {
      currentTest.negative = true;
    });
    describe("When the route is not matching login", () => {
      beforeEach(() => {
        currentTest.history.push("/");
        currentTest.attr = "login";
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
    describe("When the route is matching login", () => {
      beforeEach(() => {
        currentTest.history.push("/");
        currentTest.attr = "login";
        const state = { ...initialState, login: false };
        render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should redirect as expected", () => {
        expect(Route).toHaveBeenCalledTimes(2);

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
      beforeEach(() => {
        currentTest.history.push("/");
        currentTest.attr = "error";
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
    describe("When the route is matching error", () => {
      beforeEach(() => {
        currentTest.history.push("/");
        currentTest.attr = "error";
        const state = { ...initialState, error: true };
        render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should redirect as expected", () => {
        expect(Route).toHaveBeenCalledTimes(2);
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
