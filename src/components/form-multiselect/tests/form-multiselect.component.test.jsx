import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import MultiDropDown from "../form-multiselect.component";

const setErrorMsg = jest.fn();
const handleState = jest.fn();

const option1 = { id: 1, name: "Value1" };
const option2 = { id: 2, name: "Value2" };

const props = {
  storeState: [option2],
  setErrorMsg,
  handleState,
  item: {},
  label: "Some Label",
  fieldName: "name",
  type: "text",
  transaction: false,
  details: "Some Detail",
  options: [option1, option2],
};

describe("Setup Environment, all fields populated", () => {
  let tests = [1, 2, 3];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<MultiDropDown {...props} />);
  });

  afterEach(cleanup);

  it("should render and handle a new selection as expected", async () => {
    expect(currentTest).toBe(1);
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
    expect(handleState).toBeCalledWith([option2, option1]);
  });

  it("should render and handle a removal as expected", async () => {
    expect(currentTest).toBe(2);
    expect(utils.getByText("Some Label")).toBeTruthy();
    expect(utils.getByText("Some Detail")).toBeTruthy();

    expect(utils.getByTestId(`input_${props.fieldName}_parent`)).toBeTruthy();
    const node = utils.container.querySelector(".list__multi-value__remove");
    fireEvent.click(node, "click");

    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(1));
    await waitFor(() => expect(handleState).toBeCalledTimes(1));

    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith([]);
  });

  it("should render and handle a clear as expected", async () => {
    expect(currentTest).toBe(3);
    expect(utils.getByText("Some Label")).toBeTruthy();
    expect(utils.getByText("Some Detail")).toBeTruthy();

    expect(utils.getByTestId(`input_${props.fieldName}_parent`)).toBeTruthy();
    const node = utils.container.querySelector(".list__clear-indicator");
    fireEvent.mouseDown(node, "click");

    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(1));
    await waitFor(() => expect(handleState).toBeCalledTimes(1));

    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith([]);
  });
});

describe("Setup Environment, no label or details", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    const testProps = { ...props, details: null, label: null, size: 25 };
    utils = render(<MultiDropDown {...testProps} />);
  });

  afterEach(cleanup);

  it("should render as expected", async () => {
    expect(currentTest).toBe(1);
    expect(utils.queryByText("Some Label")).toBeFalsy();
    expect(utils.queryByText("Some Detail")).toBeFalsy();
    expect(utils.getByTestId(`input_${props.fieldName}_parent`)).toBeTruthy();
    expect(
      utils.container.querySelector(".list__dropdown-indicator")
    ).toBeTruthy();
  });
});
