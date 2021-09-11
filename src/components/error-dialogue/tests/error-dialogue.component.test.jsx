import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { createBrowserHistory } from "history";
import i18next from "i18next";
import React from "react";
import { Router } from "react-router-dom";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import ErrorDialogue from "../error-dialogue.component";

jest.mock("@material-ui/icons/WarningOutlined", () => ({
  __esModule: true,
  default: jest.fn(),
}));
WarningOutlinedIcon.mockImplementation(() => <div>MockWarning</div>);

const mockHeaderUpdate = jest.fn();
const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

let ErrorProps = {
  clearError: jest.fn(),
  eventMessage: AnalyticsActions.TestAction,
  messageTranslationKey: "Testing.GenericMultiLineTranslationTestString",
  redirect: Routes.menu,
};

const history = createBrowserHistory();

const renderHelper = (history, currentProps) => {
  return render(
    <HeaderContext.Provider
      value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
    >
      <Router history={history}>
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <ErrorDialogue {...currentProps} history={history} />
        </AnalyticsContext.Provider>
      </Router>
    </HeaderContext.Provider>
  );
};

describe("Setup Environment", () => {
  let utils;
  let current;
  let testRoute;

  beforeEach(() => {
    jest.clearAllMocks();
    testRoute = "/test/route";
    current = { ...ErrorProps };
    history.push(Routes.menu);
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
        utils = renderHelper(history, { ...current });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          title: "ErrorDialogue.ErrorDialogueHeaderTitle",
          create: null,
          transaction: false,
          disableNav: true,
        });
        expect(i18next.t("ErrorDialogue.ErrorDialogueHeaderTitle")).toBe(
          Strings.ErrorDialogue.ErrorDialogueHeaderTitle
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

      it("should handle the confirmation button as expected, route goes back", async () => {
        const button = utils.getByTestId("ErrorConfirmation");
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
        await waitFor(() =>
          expect(history.location.pathname).not.toBe(testRoute)
        );
        await waitFor(() =>
          expect(history.location.pathname).toBe(Routes.menu)
        );
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("when given a route with no redirect", () => {
      beforeEach(() => {
        delete current.redirect;
        history.push(testRoute);
        utils = renderHelper(history, { ...current });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          title: "ErrorDialogue.ErrorDialogueHeaderTitle",
          create: null,
          transaction: false,
          disableNav: true,
        });
        expect(i18next.t("ErrorDialogue.ErrorDialogueHeaderTitle")).toBe(
          Strings.ErrorDialogue.ErrorDialogueHeaderTitle
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

      it("should handle the confirmation button as expected, route goes back", async () => {
        const button = utils.getByTestId("ErrorConfirmation");
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(history.location.pathname).toBe(testRoute));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("when given a redirect", () => {
      beforeEach(() => {
        current.redirect = "/brand/new/route";
        history.push(testRoute);
        utils = renderHelper(history, { ...current });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          title: "ErrorDialogue.ErrorDialogueHeaderTitle",
          create: null,
          transaction: false,
          disableNav: true,
        });
        expect(i18next.t("ErrorDialogue.ErrorDialogueHeaderTitle")).toBe(
          Strings.ErrorDialogue.ErrorDialogueHeaderTitle
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

      it("should handle the confirmation button as expected, route goes back", async () => {
        const button = utils.getByTestId("ErrorConfirmation");
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
        await waitFor(() =>
          expect(history.location.pathname).toBe(current.redirect)
        );
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
        utils = renderHelper(history, { ...current });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          title: "ErrorDialogue.ErrorDialogueHeaderTitle",
          create: null,
          transaction: false,
          disableNav: true,
        });
        expect(i18next.t("ErrorDialogue.ErrorDialogueHeaderTitle")).toBe(
          Strings.ErrorDialogue.ErrorDialogueHeaderTitle
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
