import { render, cleanup } from "@testing-library/react";
import React from "react";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import ErrorDialogue from "../../error-dialogue/error-dialogue.component";
import ErrorHandler from "../error-handler.component";

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
    });
    describe("When given a redirect", () => {
      beforeEach(() => {
        utils = renderHelper(current);
      });
      it("should render the error dialogue", () => {
        expect(utils.queryByText(mockContent)).toBeFalsy();
        expect(ErrorDialogue).toBeCalledTimes(1);
      });
    });

    describe("When no redirect is supplied", () => {
      beforeEach(() => {
        delete current.redirect;
        utils = renderHelper(current);
      });

      it("hould render the error dialogue", () => {
        expect(utils.queryByText(mockContent)).toBeFalsy();
        expect(ErrorDialogue).toBeCalledTimes(1);
      });
    });
  });
});
