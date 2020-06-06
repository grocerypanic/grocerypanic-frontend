import React from "react";
import { render, cleanup } from "@testing-library/react";

import Help from "../simple-list-help.component";

import Strings from "../../../configuration/strings";

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    currentTest = tests.shift();
    utils = render(
      <Help>{Strings.Testing.GenericMultiLineTranslationTestString}</Help>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message content", () => {
    expect(currentTest).toBe(1);
    const node = utils.getByTestId("ListDialogue");
    expect(node).toBeTruthy();
    expect(
      utils.getAllByText(Strings.Testing.GenericTranslationTestString).length
    ).toBe(2);
  });
});
