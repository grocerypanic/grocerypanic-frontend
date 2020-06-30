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
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    utils = render(<MenuItem {...props} />);
  });

  afterEach(cleanup);

  it("should render with the correct message", () => {
    expect(utils.getByText(props.name)).toBeTruthy();
  });

  it("should handle a click correctly", () => {
    const node = utils.getByTestId("MenuElement");
    fireEvent.click(node, "click");
    expect(props.choose).toHaveBeenCalledWith(props.location);
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container.firstChild).toMatchSnapshot();
  });
});
