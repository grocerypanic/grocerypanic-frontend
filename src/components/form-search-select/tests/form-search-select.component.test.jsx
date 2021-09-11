import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import SearchSelect from "../form-search-select.component";

const setErrorMsg = jest.fn();
const handleState = jest.fn();

const option1 = { id: 1, name: "Value1" };
const option2 = { id: 2, name: "Value2" };
const option3 = { id: 3, name: "Default" };

const props = {
  storeState: option3,
  setErrorMsg,
  handleState,
  item: {},
  label: "Some Label",
  fieldName: "name",
  type: "text",
  transaction: false,
  details: "Some Detail",
  options: [option1, option2, option3],
};

describe("Setup Environment, all fields populated", () => {
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    utils = render(<SearchSelect {...props} />);
  });

  afterEach(cleanup);

  it("should render and handle a new selection as expected", async () => {
    expect(utils.getByText("Some Label")).toBeTruthy();
    expect(utils.getByText("Some Detail")).toBeTruthy();

    expect(utils.getByTestId(`input_${props.fieldName}_parent`)).toBeTruthy();
    const node = utils.container.querySelector(".list__dropdown-indicator");
    fireEvent.mouseDown(node, "click");
    await waitFor(() => expect(utils.getByText(option1.name)).toBeTruthy());
    await waitFor(() => expect(utils.getByText(option2.name)).toBeTruthy());
    const value1 = utils.getByText(option1.name);
    fireEvent.click(value1, "click");

    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(1));
    await waitFor(() => expect(handleState).toBeCalledTimes(1));

    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith(option1);
  });
});

describe("Setup Environment, no label or details", () => {
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    const testProps = { ...props, details: null, label: null, size: 25 };
    utils = render(<SearchSelect {...testProps} />);
  });

  afterEach(cleanup);

  it("should render as expected", async () => {
    expect(utils.queryByText("Some Label")).toBeFalsy();
    expect(utils.queryByText("Some Detail")).toBeFalsy();
    expect(utils.getByTestId(`input_${props.fieldName}_parent`)).toBeTruthy();
    expect(
      utils.container.querySelector(".list__dropdown-indicator")
    ).toBeTruthy();
  });
});
