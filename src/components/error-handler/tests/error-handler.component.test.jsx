import React from "react";
import { render, cleanup } from "@testing-library/react";

import ErrorHandler from "../error-handler.component";
import ErrorDialogue from "../../error-dialogue/error-dialogue.component";

import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import Strings from "../../../configuration/strings";

jest.mock("../../error-dialogue/error-dialogue.component");
ErrorDialogue.mockImplementation(() => <div>I am a error!</div>);

let current;

const props = {
  condition: true,
  clearError: jest.fn(),
  eventMessage: AnalyticsActions.TestAction,
  stringsRoot: Strings.Testing,
  string: "GenericMultiLineTranslationTestString",
  redirect: "/SomePath",
};

describe("Setup Environment", () => {
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
    current = { ...props };
  });

  afterEach(cleanup);

  describe("When condition is false", () => {
    beforeEach(() => {
      current.condition = false;
      utils = render(
        <ErrorHandler {...current}>Suppressed Component</ErrorHandler>
      );
    });

    it("should render with the correct message", () => {
      expect(utils.queryByText("Suppressed Component")).toBeTruthy();
      expect(ErrorDialogue).toBeCalledTimes(0);
    });
  });

  describe("When condition is true", () => {
    beforeEach(() => {
      current.condition = true;
      utils = render(
        <ErrorHandler {...current}>Suppressed Component</ErrorHandler>
      );
    });

    it("should render the spinner instead", () => {
      expect(utils.queryByText("Suppressed Component")).toBeFalsy();
      expect(ErrorDialogue).toBeCalledTimes(1);
    });
  });
});
