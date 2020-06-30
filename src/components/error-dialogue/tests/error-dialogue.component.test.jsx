import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import ErrorDialogue from "../error-dialogue.component";

import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";

import Strings from "../../../configuration/strings";
import Routes from "../../../configuration/routes";

jest.mock("@material-ui/icons/WarningOutlined", () => ({
  __esModule: true,
  default: jest.fn(),
}));
WarningOutlinedIcon.mockImplementation(() => <div>MockWarning</div>);

const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

let ErrorProps = {
  clearError: jest.fn(),
  eventMessage: AnalyticsActions.TestAction,
  stringsRoot: Strings.Testing,
  string: "GenericMultiLineTranslationTestString", // String Key
  redirect: Routes.root,
};

const history = createBrowserHistory();

describe("Setup Environment", () => {
  let utils;
  let current;
  let testRoute;

  beforeEach(() => {
    jest.clearAllMocks();
    testRoute = "/test/route";
    current = { ...ErrorProps };
    history.push(Routes.root);
  });

  describe("when given a valid analytics event message", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      current.eventMessage = AnalyticsActions.TestAction;
    });

    describe("when given a redirect to go back", () => {
      beforeEach(() => {
        current.redirect = Routes.goBack;
        history.push(testRoute);
        utils = render(
          <Router history={history}>
            <AnalyticsContext.Provider value={mockAnalyticsSettings}>
              <ErrorDialogue {...current} history={history} />
            </AnalyticsContext.Provider>
          </Router>
        );
      });

      it("should render with the correct components and messages", () => {
        expect(
          utils.getAllByText(Strings.Testing.GenericTranslationTestString)
            .length
        ).toBe(2);
        expect(WarningOutlinedIcon).toHaveBeenCalledTimes(1);
        expect(utils.getByTestId("ErrorConfirmation")).toBeTruthy();
      });

      it("should send the event as expected", () => {
        expect(mockEvent).toHaveBeenCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
      });

      it("should handle the confirmation button as expected, route goes back", async (done) => {
        const button = utils.getByTestId("ErrorConfirmation");
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
        await waitFor(() =>
          expect(history.location.pathname).not.toBe(testRoute)
        );
        await waitFor(() =>
          expect(history.location.pathname).toBe(Routes.root)
        );
        done();
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("when given a route with no redirect", () => {
      beforeEach(() => {
        delete current.redirect;
        history.push(testRoute);
        utils = render(
          <Router history={history}>
            <AnalyticsContext.Provider value={mockAnalyticsSettings}>
              <ErrorDialogue {...current} history={history} />
            </AnalyticsContext.Provider>
          </Router>
        );
      });

      it("should render with the correct components and messages", () => {
        expect(
          utils.getAllByText(Strings.Testing.GenericTranslationTestString)
            .length
        ).toBe(2);
        expect(WarningOutlinedIcon).toHaveBeenCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
        expect(utils.getByTestId("ErrorConfirmation")).toBeTruthy();
      });

      it("should handle the confirmation button as expected, route goes back", async (done) => {
        const button = utils.getByTestId("ErrorConfirmation");
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(history.location.pathname).toBe(testRoute));
        done();
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("when given a redirect", () => {
      beforeEach(() => {
        current.redirect = "/brand/new/route";
        history.push(testRoute);
        utils = render(
          <Router history={history}>
            <AnalyticsContext.Provider value={mockAnalyticsSettings}>
              <ErrorDialogue {...current} history={history} />
            </AnalyticsContext.Provider>
          </Router>
        );
      });

      it("should render with the correct components and messages", () => {
        expect(
          utils.getAllByText(Strings.Testing.GenericTranslationTestString)
            .length
        ).toBe(2);
        expect(WarningOutlinedIcon).toHaveBeenCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
        expect(utils.getByTestId("ErrorConfirmation")).toBeTruthy();
      });

      it("should handle the confirmation button as expected, route goes back", async (done) => {
        const button = utils.getByTestId("ErrorConfirmation");
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
        await waitFor(() =>
          expect(history.location.pathname).toBe(current.redirect)
        );
        done();
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe("when given an invalid analytics event message", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      current.eventMessage = null;
    });

    describe("when given any redirect type", () => {
      beforeEach(() => {
        current.redirect = Routes.goBack;
        history.push(testRoute);
        utils = render(
          <Router history={history}>
            <AnalyticsContext.Provider value={mockAnalyticsSettings}>
              <ErrorDialogue {...current} history={history} />
            </AnalyticsContext.Provider>
          </Router>
        );
      });

      it("should render with the correct components and messages", () => {
        expect(
          utils.getAllByText(Strings.Testing.GenericTranslationTestString)
            .length
        ).toBe(2);
        expect(WarningOutlinedIcon).toHaveBeenCalledTimes(1);
        expect(utils.getByTestId("ErrorConfirmation")).toBeTruthy();
      });

      it("should not send any the event", () => {
        expect(mockEvent).toHaveBeenCalledTimes(0);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });

  afterEach(cleanup);
});
