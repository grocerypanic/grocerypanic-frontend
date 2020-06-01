import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";

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
  message: Strings.GenericTranslationTestString,
  redirect: Routes.root,
};

describe("Setup Environment", () => {
  let tests = [1, 2];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(
      <AnalyticsContext.Provider value={mockAnalyticsSettings}>
        <ErrorDialogue {...ErrorProps} />
      </AnalyticsContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render with the correct components and messages", () => {
    expect(currentTest).toBe(1);
    expect(utils.getByText(Strings.GenericTranslationTestString)).toBeTruthy();
    expect(WarningOutlinedIcon).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
    expect(utils.getByTestId("ErrorConfirmation")).toBeTruthy();
  });

  it("should render with the correct components and messages", () => {
    expect(currentTest).toBe(2);
    const button = utils.getByTestId("ErrorConfirmation");
    expect(ErrorProps.clearError).toHaveBeenCalledTimes(0);
    fireEvent.click(button);
    expect(ErrorProps.clearError).toHaveBeenCalledTimes(1);
  });
});
