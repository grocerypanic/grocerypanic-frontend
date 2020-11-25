import React from "react";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";

import useLongPress from "../longpress";

const mockShortCallback = jest.fn();
const mockLongCallBack = jest.fn();

const TestComponent = () => {
  const handleClick = useLongPress(mockLongCallBack, mockShortCallback, 500);

  return <div data-testid={"TestDiv"} {...handleClick}></div>;
};

const TestComponentDefaults = () => {
  const handleClickDefaults = useLongPress();

  return <div data-testid={"TestDiv"} {...handleClickDefaults}></div>;
};

describe("Setup Environment", () => {
  let tests = [
    { id: 1, component: <TestComponent /> },
    { id: 2, component: <TestComponent /> },
    { id: 3, component: <TestComponent /> },
    { id: 4, component: <TestComponent /> },
    { id: 5, component: <TestComponentDefaults /> },
  ];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(currentTest.component);
  });

  afterEach(cleanup);

  it("should handle short presses correctly", async () => {
    expect(currentTest.id).toBe(1);
    const testdiv = utils.getByTestId("TestDiv");
    fireEvent.mouseDown(testdiv, "click");
    fireEvent.mouseUp(testdiv, "click");
    await waitFor(() => expect(mockShortCallback).toBeCalledTimes(1));
    expect(mockLongCallBack).toBeCalledTimes(0);
  });

  it("should handle long presses correctly", (done) => {
    expect(currentTest.id).toBe(2);
    const testdiv = utils.getByTestId("TestDiv");
    fireEvent.mouseDown(testdiv, "click");
    setTimeout(async () => {
      fireEvent.mouseUp(testdiv, "click");
      await waitFor(() => expect(mockLongCallBack).toBeCalledTimes(1));
      expect(mockShortCallback).toBeCalledTimes(1);
      done();
    }, 500);
  });

  it("should handle long touches correctly", async () => {
    expect(currentTest.id).toBe(3);
    const testdiv = utils.getByTestId("TestDiv");
    fireEvent.touchStart(testdiv, "click");
    setTimeout(() => fireEvent.touchEnd(testdiv, "click"), 500);
    await waitFor(() => expect(mockLongCallBack).toBeCalledTimes(1));
    expect(mockShortCallback).toBeCalledTimes(1);
  });

  it("should handle mouseleave correctly", (done) => {
    expect(currentTest.id).toBe(4);
    const testdiv = utils.getByTestId("TestDiv");
    fireEvent.mouseDown(testdiv, "click");
    setTimeout(async () => {
      await waitFor(() => expect(mockLongCallBack).toBeCalledTimes(1));
      expect(mockShortCallback).toBeCalledTimes(1);
      fireEvent.mouseLeave(testdiv, "click");
      done();
    }, 500);
  });

  it("should handle default arguments events", (done) => {
    expect(currentTest.id).toBe(5);
    const testdiv = utils.getByTestId("TestDiv");
    fireEvent.mouseDown(testdiv, "click");
    setTimeout(() => {
      fireEvent.mouseUp(testdiv, "click");
      expect(mockLongCallBack).toBeCalledTimes(0);
      expect(mockShortCallback).toBeCalledTimes(0);
      done();
    }, 500);
  });
});
