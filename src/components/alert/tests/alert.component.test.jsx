import { render, cleanup } from "@testing-library/react";
import React from "react";
import Assets from "../../../configuration/assets";
import Alert from "../alert.component";

describe("Setup Environment", () => {
  let utils;
  let message;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("when a message is not passed to the component", () => {
    beforeEach(() => {
      utils = render(<Alert />);
    });

    it("should render with with a non breaking space", () => {
      const node = utils.getByTestId("alert");
      expect(node.textContent).toBe(Assets.nonBreakingSpace);
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });

  describe("when a message is passed to the component", () => {
    beforeEach(() => {
      message = "Test Message";
      utils = render(<Alert message={message} />);
    });

    it("should render with the translated message", () => {
      expect(message).not.toBe(null);
      expect(utils.getByText(message)).toBeTruthy();
      expect(utils.getByTestId("alert")).toBeTruthy();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container.firstChild).toMatchSnapshot();
    });
  });
});
