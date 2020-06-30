import React from "react";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import Header from "../../header/header.component";
import Dialogue from "../dialogue.component";

import calculateMaxHeight from "../../../util/height";

jest.mock("../../header/header.component");
jest.mock("../../../util/height");

Header.mockImplementation(() => <div>MockHeader</div>);
calculateMaxHeight.mockImplementation(() => 200);
const Footer = jest.fn(() => <div>MockFooter</div>);

const defaultProps = {
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  body: "mockbody1\nmockbody2",
  Footer: Footer,
};

describe("Setup Environment", () => {
  let current;
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    current = {
      ...defaultProps,
    };
  });

  afterEach(cleanup);

  const renderHelper = (currentProps) => {
    return render(<Dialogue {...currentProps} />);
  };

  describe("when passed parameters", () => {
    beforeEach(() => {
      utils = renderHelper(current);
    });

    it("renders, should call header with the correct params", () => {
      expect(Header).toHaveBeenCalledTimes(1);

      const headerCall = Header.mock.calls[0][0];
      propCount(headerCall, 2);
      expect(headerCall.title).toBe(defaultProps.headerTitle);
      expect(headerCall.transaction).toBe(false);
    });

    it("renders, should display the title", () => {
      expect(utils.getByText(defaultProps.title)).toBeTruthy();
    });

    it("renders, should display the body", () => {
      defaultProps.body.split("\n").forEach((o) => {
        expect(utils.getByText(o)).toBeTruthy();
      });
    });

    it("renders, should display the footer object", () => {
      expect(Footer).toBeCalledTimes(1);
    });

    it("renders, should call calculateMaxHeight", () => {
      expect(calculateMaxHeight).toBeCalledTimes(1);
    });

    it("renders, should call calculateMaxHeight on a resize event", async (done) => {
      expect(calculateMaxHeight).toBeCalledTimes(1);
      fireEvent(window, new Event("resize"));
      await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
      done();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container).toMatchSnapshot();
    });
  });
});
