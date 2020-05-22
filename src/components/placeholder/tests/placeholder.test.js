import React from "react";
import { render, cleanup } from "@testing-library/react";

import PlaceHolder from "../placeholder.component";

import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";

import Strings from "../../../configuration/strings";

const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    mockEvent.mockClear();
    currentTest = tests.shift();
    utils = render(
      <AnalyticsContext.Provider value={mockAnalyticsSettings}>
        <PlaceHolder />
      </AnalyticsContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message", () => {
    expect(currentTest).toBe(1);
    expect(utils.getByText(Strings.PlaceHolderMessage)).toBeTruthy();
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
  });
});
