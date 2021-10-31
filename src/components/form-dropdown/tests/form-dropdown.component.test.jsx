import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import DropDown from "../form-dropdown.component";

const setErrorMsg = jest.fn();
const handleState = jest.fn();

const props = {
  state: "Value2",
  setErrorMsg,
  handleState,
  item: {},
  label: "Some Label",
  fieldName: "name",
  type: "text",
  transaction: false,
  details: "Some Detail",
  options: [
    { id: 1, name: "Value1" },
    { id: 2, name: "Value2" },
  ],
};

describe("Setup Environment, all fields populated", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<DropDown {...props} />);
  });

  afterEach(cleanup);

  it("should render and handle input as expected", async () => {
    expect(currentTest).toBe(1);
    expect(utils.getByText("Some Label")).toBeTruthy();
    expect(utils.getByText("Some Detail")).toBeTruthy();
    const node = utils.getByTestId(`input_${props.fieldName}`);
    expect(node.value).toBe("Value2");
    fireEvent.change(node, {
      target: { value: "Value1" },
    });
    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(1));
    await waitFor(() => expect(handleState).toBeCalledTimes(1));

    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith("Value1");
  });
});

describe("Setup Environment, no label or details", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    const testProps = {
      ...props,
      details: null,
      label: null,
      size: 25,
    };
    utils = render(<DropDown {...testProps} />);
  });

  afterEach(cleanup);

  it("should render and handle input as expected", async () => {
    expect(currentTest).toBe(1);
    expect(utils.queryByText("Some Label")).toBeFalsy();
    expect(utils.queryByText("Some Detail")).toBeFalsy();
    const node = utils.getByTestId(`input_${props.fieldName}`);
    expect(node.value).toBe("Value2");
    fireEvent.change(node, {
      target: { value: "Value1" },
    });
    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(1));
    await waitFor(() => expect(handleState).toBeCalledTimes(1));

    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith("Value1");
  });
});

describe("Setup Environment, state is null", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    const testProps = {
      ...props,
      state: null,
      options: [
        { id: 0, name: null },
        { id: 1, name: "Value1" },
      ],
    };
    utils = render(<DropDown {...testProps} />);
  });

  afterEach(cleanup);

  it("should render and handle input as expected", async () => {
    expect(currentTest).toBe(1);
    expect(utils.getByText("Some Label")).toBeTruthy();
    expect(utils.getByText("Some Detail")).toBeTruthy();
    const node = utils.getByTestId(`input_${props.fieldName}`);
    expect(node.value).toBe("");
    fireEvent.change(node, {
      target: { value: "Value1" },
    });
    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(1));
    await waitFor(() => expect(handleState).toBeCalledTimes(1));
    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith("Value1");
    fireEvent.change(node, {
      target: { value: "" },
    });
    await waitFor(() => expect(setErrorMsg).toBeCalledTimes(2));
    await waitFor(() => expect(handleState).toBeCalledTimes(2));
    expect(setErrorMsg).toBeCalledWith(null);
    expect(handleState).toBeCalledWith(null);
  });
});
