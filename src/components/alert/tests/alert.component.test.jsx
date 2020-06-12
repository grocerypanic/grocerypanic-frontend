import React from "react";
import { render, cleanup } from "@testing-library/react";

import Alert from "../alert.component";

import Assets from "../../../configuration/assets";

describe("Setup Environment", () => {
  let tests = [null, "Important Message"];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<Alert message={currentTest} />);
  });

  afterEach(cleanup);

  it("should render with with a non breaking space", () => {
    expect(currentTest).toBe(null);
    const node = utils.getByTestId("alert");
    expect(node.textContent).toBe(Assets.nonBreakingSpace);
  });

  it("should render with the translated message", () => {
    expect(currentTest).not.toBe(null);
    expect(utils.getByText(currentTest)).toBeTruthy();
    expect(utils.getByTestId("alert")).toBeTruthy();
  });
});
