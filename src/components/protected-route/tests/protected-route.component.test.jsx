import React from "react";
import { render, cleanup } from "@testing-library/react";
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

let utils;
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
    currentTest.history.length = 1;
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("When the route is matching negative", () => {
    beforeEach(() => {
      currentTest.negative = true;
    });
    describe("When the route is not matching login", () => {
      beforeEach(() => {
        currentTest.attr = "login";
        const state = { ...initialState, login: true };
        utils = render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should render the component as expected", () => {
        expect(Route).toHaveBeenCalledTimes(1);
        const call = Route.mock.calls[0][0];
        expect(call.component).toBe(MockComponent);
        expect(call.exact).toBeTruthy();
        expect(call.path).toBe("/");
        expect(currentTest.history.location.pathname).toBe(Routes.root);
      });
    });
    describe("When the route is matching login", () => {
      beforeEach(() => {
        currentTest.attr = "login";
        const state = { ...initialState, login: false };
        utils = render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should redirect as expected", () => {
        expect(Route).toHaveBeenCalledTimes(2);
        expect(MockComponent).toHaveBeenCalledTimes(0);
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
        currentTest.attr = "error";
        const state = { ...initialState, error: false };
        utils = render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should render the component as expected", () => {
        expect(Route).toHaveBeenCalledTimes(1);
        const call = Route.mock.calls[0][0];
        expect(call.component).toBe(MockComponent);
        expect(call.exact).toBeTruthy();
        expect(call.path).toBe("/");
        expect(currentTest.history.location.pathname).toBe(Routes.shelves);
      });
    });
    describe("When the route is matching error", () => {
      beforeEach(() => {
        currentTest.attr = "error";
        const state = { ...initialState, error: true };
        utils = render(<RenderFunction state={state} {...currentTest} />);
      });

      it("should redirect as expected", () => {
        expect(Route).toHaveBeenCalledTimes(2);
        expect(MockComponent).toHaveBeenCalledTimes(0);
        expect(currentTest.history.location.pathname).toBe(Routes.shelves);
      });
    });
  });
});
