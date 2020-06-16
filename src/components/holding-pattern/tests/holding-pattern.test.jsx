import React from "react";
import { render, cleanup } from "@testing-library/react";

import HoldingPattern from "../holding-pattern.component";

let condition = false;

describe("Setup Environment", () => {
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("When condition is false", () => {
    beforeEach(() => {
      condition = false;
      utils = render(
        <HoldingPattern condition={condition}>
          Suppressed Component
        </HoldingPattern>
      );
    });

    it("should render with the correct message", () => {
      expect(utils.queryByText("Suppressed Component")).toBeTruthy();
      expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
    });
  });

  describe("When condition is true", () => {
    beforeEach(() => {
      condition = true;
      utils = render(
        <HoldingPattern condition={condition}>
          Suppressed Component
        </HoldingPattern>
      );
    });

    it("should render the spinner instead", () => {
      expect(utils.queryByText("Suppressed Component")).toBeFalsy();
      expect(utils.queryByTestId("HoldingPattern")).toBeTruthy();
    });
  });
});
