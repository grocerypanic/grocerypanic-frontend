import ReactGA from "react-ga";
import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import AnalyticsProvider, { AnalyticsContext } from "../analytics.provider";

jest.mock("react-ga");
const originalEnvironment = process.env;

describe("Manage Environment", () => {
  let received = {};
  let history;
  beforeEach(() => {
    jest.clearAllMocks();
    history = createMemoryHistory();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const changePage = () => {
    history.push("/");
  };

  const renderHelper = (currentHistory) => {
    return render(
      <Router history={currentHistory}>
        <AnalyticsProvider>
          <AnalyticsContext.Consumer>
            {(state) => (
              <div>
                {Object.keys(state).forEach(function (key) {
                  received[key] = state[key];
                })}
              </div>
            )}
          </AnalyticsContext.Consumer>
        </AnalyticsProvider>
      </Router>
    );
  };

  describe("not in production", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "test";
    });

    describe("no analytics value is present", () => {
      beforeEach(() => {
        process.env.REACT_APP_UA_CODE = "";
        renderHelper(history);
      });

      it("should not initialize ReactGA", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeFalsy());
        done();
      });

      it("should not post events", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeFalsy());

        act(() => received.event("FAKE_EVENT"));
        await waitFor(() => expect(ReactGA.event).toHaveBeenCalledTimes(0));
        done();
      });
    });

    describe("analytics value is present", () => {
      beforeEach(() => {
        process.env.REACT_APP_UA_CODE = "SOMEVALUE";
        renderHelper(history);
      });

      it("should initialize ReactGA, in debug mode", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeTruthy());
        expect(ReactGA.initialize).toHaveBeenCalledTimes(1);
        expect(ReactGA.initialize).toHaveBeenCalledWith(
          process.env.REACT_APP_UA_CODE,
          { debug: true }
        );
        done();
      });

      it("should post events, after setup", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeTruthy());

        act(() => received.event("FAKE_EVENT"));
        await waitFor(() => expect(ReactGA.event).toHaveBeenCalledTimes(1));
        expect(ReactGA.event).toHaveBeenCalledWith("FAKE_EVENT");
        done();
      });

      it("should track route changes", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeTruthy());
        act(() => changePage());
        await waitFor(() => expect(ReactGA.set).toHaveBeenCalledTimes(1));
        expect(ReactGA.set).toHaveBeenCalledWith({ page: "/" });
        expect(ReactGA.pageview).toHaveBeenCalledTimes(1);
        expect(ReactGA.pageview).toHaveBeenCalledWith("/");
        done();
      });
    });
  });

  describe("in production", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    describe("no analytics value is present", () => {
      beforeEach(() => {
        process.env.REACT_APP_UA_CODE = "";
        renderHelper(history);
      });

      it("should not initialize ReactGA", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeFalsy());
        expect(ReactGA.initialize).toHaveBeenCalledTimes(0);
        done();
      });

      it("should not post events, even after setup attempt", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeFalsy());

        act(() => received.event("FAKE_EVENT"));
        await waitFor(() => expect(ReactGA.event).toHaveBeenCalledTimes(0));
        done();
      });
    });

    describe("analytics value is present", () => {
      beforeEach(() => {
        process.env.REACT_APP_UA_CODE = "SOMEVALUE";
        renderHelper(history);
      });

      it("should initialize ReactGA, in debug mode", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeTruthy());
        expect(ReactGA.initialize).toHaveBeenCalledTimes(1);
        expect(ReactGA.initialize).toHaveBeenCalledWith(
          process.env.REACT_APP_UA_CODE,
          { debug: false }
        );
        done();
      });

      it("should post events", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeTruthy());

        act(() => received.event("FAKE_EVENT"));
        await waitFor(() => expect(ReactGA.event).toHaveBeenCalledTimes(1));
        expect(ReactGA.event).toHaveBeenCalledWith("FAKE_EVENT");
        done();
      });

      it("should track route changes", async (done) => {
        expect(Object.keys(received).length).toBe(3);
        expect(received.event).toBeInstanceOf(Function);
        expect(received.setup).toBeInstanceOf(Function);
        expect(received.initialized).toBeFalsy();

        act(() => received.setup());
        await waitFor(() => expect(received.initialized).toBeTruthy());
        act(() => changePage());
        await waitFor(() => expect(ReactGA.set).toHaveBeenCalledTimes(1));
        expect(ReactGA.set).toHaveBeenCalledWith({ page: "/" });
        expect(ReactGA.pageview).toHaveBeenCalledTimes(1);
        expect(ReactGA.pageview).toHaveBeenCalledWith("/");
        done();
      });
    });
  });
});
