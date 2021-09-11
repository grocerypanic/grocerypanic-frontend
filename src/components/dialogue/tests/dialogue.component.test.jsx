import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import calculateMaxHeight from "../../../util/height";
import Dialogue from "../dialogue.component";

jest.mock("../../../util/height");
const mockHeaderUpdate = jest.fn();

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
    return render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <Dialogue {...currentProps} />
      </HeaderContext.Provider>
    );
  };

  describe("when passed parameters", () => {
    beforeEach(() => {
      utils = renderHelper(current);
    });

    it("renders, should call header with the correct params", () => {
      expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
      expect(mockHeaderUpdate).toBeCalledWith({
        title: defaultProps.headerTitle,
        create: null,
        transaction: false,
        disableNav: false,
      });
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

    it("renders, should call calculateMaxHeight on a resize event", async () => {
      expect(calculateMaxHeight).toBeCalledTimes(1);
      fireEvent(window, new Event("resize"));
      await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container).toMatchSnapshot();
    });
  });
});
