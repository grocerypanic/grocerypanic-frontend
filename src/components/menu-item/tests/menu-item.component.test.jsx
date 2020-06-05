import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import MenuItem from "../menu-item.component";

const mockChoose = jest.fn();

const props = {
  name: "someName",
  location: "/someLocation",
  choose: mockChoose,
};

describe("Setup Environment", () => {
  let tests = [1, 2];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<MenuItem {...props} />);
  });

  afterEach(cleanup);

  it("should render with the correct message", () => {
    expect(currentTest).toBe(1);
    expect(utils.getByText(props.name)).toBeTruthy();
  });

  it("should handle a click correctly", () => {
    expect(currentTest).toBe(2);
    const node = utils.getByTestId("MenuElement");
    fireEvent.click(node, "click");
    expect(props.choose).toHaveBeenCalledWith(props.location);
  });
});
