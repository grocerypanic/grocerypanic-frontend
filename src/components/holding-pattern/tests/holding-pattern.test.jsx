import { render, cleanup } from "@testing-library/react";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import HoldingPattern from "../holding-pattern.component";

const mockHeaderUpdate = jest.fn();
jest.mock("react-bootstrap/Spinner", () => ({
  __esModule: true,
  default: jest.fn(() => <div>MockSpinner</div>),
}));

describe("Setup Environment", () => {
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  const renderHelper = (currentProps) => {
    return render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <HoldingPattern {...currentProps}>Suppressed Component</HoldingPattern>
      </HeaderContext.Provider>
    );
  };

  describe("When condition is false", () => {
    describe("with defaults", () => {
      beforeEach(() => {
        utils = renderHelper({ condition: false });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(0);
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
        utils = renderHelper({
          condition: false,
          animation: "other1",
          color: "other2",
        });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(0);
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
        utils = renderHelper({ condition: true });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          disableNav: true,
        });
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
        utils = renderHelper({
          condition: true,
          animation: "other1",
          color: "other2",
        });
      });

      it("renders, should call header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          disableNav: true,
        });
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
