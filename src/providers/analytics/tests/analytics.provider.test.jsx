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
  let setup = [
    { code: "", NODE_ENV: "test" },
    { code: "", NODE_ENV: "test" },
    { code: "SOMEVALUE", NODE_ENV: "test" },
    { code: "SOMEVALUE", NODE_ENV: "production" },
    { code: "SOMEVALUE", NODE_ENV: "production" },
    { code: "SOMEVALUE", NODE_ENV: "production" },
    { code: "SOMEVALUE", NODE_ENV: "production" },
  ];
  let currentTest;
  beforeEach(() => {
    currentTest = setup.shift();
    process.env.REACT_APP_UA_CODE = currentTest.code;
    process.env.NODE_ENV = currentTest.NODE_ENV;
    ReactGA.initialize.mockClear();
    ReactGA.event.mockClear();
    ReactGA.set.mockClear();
    ReactGA.pageview.mockClear();
    history = createMemoryHistory();
    render(
      <Router history={history}>
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

  it("should not initialize ReactGA when no analytics value is present setup ", async (done) => {
    expect(Object.keys(received).length).toBe(3);
    expect(received.event).toBeInstanceOf(Function);
    expect(received.setup).toBeInstanceOf(Function);
    expect(received.initialized).toBeFalsy();

    act(() => received.setup());
    await waitFor(() => expect(received.initialized).toBeFalsy());
    expect(ReactGA.initialize).toHaveBeenCalledTimes(0);
    received.event("FAKE_EVENT");
    expect(ReactGA.event).toHaveBeenCalledTimes(0);
    done();
  });

  it("should not post events when no analytics value is present", async (done) => {
    expect(Object.keys(received).length).toBe(3);
    expect(received.event).toBeInstanceOf(Function);
    expect(received.setup).toBeInstanceOf(Function);
    expect(received.initialized).toBeFalsy();

    act(() => received.setup());
    await waitFor(() => expect(received.initialized).toBeFalsy());
    received.event("FAKE_EVENT");
    expect(ReactGA.event).toHaveBeenCalledTimes(0);
    done();
  });

  it("should initialize ReactGA when an analytics value is present", async (done) => {
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

  it("should initialize ReactGA without logging when an analytics value is present, and it's production", async (done) => {
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

  it("should post events when an analytics value is present ", async (done) => {
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

  it("should track route changes when an analytics value is present", async (done) => {
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

  it("should only track route changes when a route change happens, and when an analytics value is present", async (done) => {
    expect(Object.keys(received).length).toBe(3);
    expect(received.event).toBeInstanceOf(Function);
    expect(received.setup).toBeInstanceOf(Function);
    expect(received.initialized).toBeFalsy();

    act(() => received.setup());
    await waitFor(() => expect(received.initialized).toBeTruthy());
    expect(ReactGA.set).toHaveBeenCalledTimes(0);
    expect(ReactGA.pageview).toHaveBeenCalledTimes(0);
    done();
  });
});
