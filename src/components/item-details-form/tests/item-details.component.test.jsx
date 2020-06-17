import React from "react";
import { render, cleanup } from "@testing-library/react";

import Header from "../../header/header.component";
import ItemDetails from "../item-details.component";
import ItemDetailsForm from "../item-details.form";

jest.mock("../../header/header.component");
jest.mock("../item-details.component");
Header.mockImplementation(() => <div>MockHeader</div>);
ItemDetailsForm.mockImplementation(() => <div>MockItemDetailsForm</div>);

import Strings from "../../../configuration/strings";

const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    utils = render(<ItemDetails></ItemDetails>);
  });

  afterEach(cleanup);

  it("should render with the correct message", () => {
    expect(currentTest).toBe(1);
    expect(
      utils.getByText(Strings.PlaceHolder.PlaceHolderMessage)
    ).toBeTruthy();
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
  });
});
