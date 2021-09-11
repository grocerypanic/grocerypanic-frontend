import { render, cleanup } from "@testing-library/react";
import React from "react";
import GeneratePopOver from "../popover.component";

const mockTranslate = jest.fn();
mockTranslate.mockReturnValue("Some String");
const mockTitle = "title";
const mockMessage = "message";

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(
      <GeneratePopOver
        translate={mockTranslate}
        title={mockTitle}
        message={mockMessage}
      >
        <div>Child Element</div>
      </GeneratePopOver>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message", () => {
    expect(currentTest).toBe(1);
    expect(mockTranslate).toBeCalledTimes(2);
    expect(mockTranslate).toBeCalledWith(mockTitle);
    expect(mockTranslate).toBeCalledWith(mockMessage);
    expect(utils.getByText("Child Element")).toBeTruthy();
  });
});
