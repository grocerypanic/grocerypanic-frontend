import React from "react";
import { render, cleanup } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import HoldingPattern from "../holding-pattern.component";
import Spinner from "react-bootstrap/Spinner";

jest.mock("react-bootstrap/Spinner", () => ({
  __esModule: true,
  default: jest.fn(() => <div>MockSpinner</div>),
}));

let condition = false;

describe("Setup Environment", () => {
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("When condition is false", () => {
    describe("with defaults", () => {
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
        expect(Spinner).toBeCalledTimes(0);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("with custom values", () => {
      beforeEach(() => {
        condition = false;
        utils = render(
          <HoldingPattern
            animation={"other1"}
            color={"other2"}
            condition={condition}
          >
            Suppressed Component
          </HoldingPattern>
        );
      });

      it("should render with the correct message", () => {
        expect(utils.queryByText("Suppressed Component")).toBeTruthy();
        expect(utils.queryByTestId("HoldingPattern")).toBeFalsy();
        expect(Spinner).toBeCalledTimes(0);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe("When condition is true", () => {
    describe("with defaults", () => {
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
        expect(Spinner).toBeCalledTimes(1);
        const call = Spinner.mock.calls[0][0];
        propCount(call, 3);
        expect(call.animation).toBe("grow");
        expect(call.variant).toBe("success");
        expect(call.className).toBe("kindly-hang-in-there");
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });

    describe("with custom values", () => {
      beforeEach(() => {
        condition = true;
        utils = render(
          <HoldingPattern
            animation={"other1"}
            color={"other2"}
            condition={condition}
          >
            Suppressed Component
          </HoldingPattern>
        );
      });

      it("should render with the correct message", () => {
        expect(utils.queryByText("Suppressed Component")).toBeFalsy();
        expect(utils.queryByTestId("HoldingPattern")).toBeTruthy();
        expect(Spinner).toBeCalledTimes(1);
        const call = Spinner.mock.calls[0][0];
        propCount(call, 3);
        expect(call.animation).toBe("other1");
        expect(call.variant).toBe("other2");
        expect(call.className).toBe("kindly-hang-in-there");
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container.firstChild).toMatchSnapshot();
      });
    });
  });
});
