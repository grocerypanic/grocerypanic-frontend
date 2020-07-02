import React from "react";
import { render, cleanup } from "@testing-library/react";

import ErrorHandler from "../error-handler.component";
import ErrorDialogue from "../../error-dialogue/error-dialogue.component";

import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";

jest.mock("../../error-dialogue/error-dialogue.component");
ErrorDialogue.mockImplementation(() => <div>I am a error!</div>);

let current;
const mockContent = "Suppressed Component";

const props = {
  condition: true,
  clearError: jest.fn(),
  eventMessage: AnalyticsActions.TestAction,
  messageTranslationKey: "Testing.GenericMultiLineTranslationTestString",
  redirect: "/SomePath",
};

describe("Setup Environment", () => {
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
    current = { ...props };
  });

  afterEach(cleanup);

  const renderHelper = (currentProps) => {
    return render(<ErrorHandler {...currentProps}>{mockContent}</ErrorHandler>);
  };

  describe("When condition is false", () => {
    beforeEach(() => {
      current.condition = false;
      utils = renderHelper(current);
    });

    it("should render with the correct message", () => {
      expect(utils.queryByText(mockContent)).toBeTruthy();
      expect(ErrorDialogue).toBeCalledTimes(0);
    });
  });

  describe("When condition is true", () => {
    beforeEach(() => {
      current.condition = true;
      utils = renderHelper(current);
    });

    it("should render the spinner instead", () => {
      expect(utils.queryByText(mockContent)).toBeFalsy();
      expect(ErrorDialogue).toBeCalledTimes(1);
    });
  });
});
