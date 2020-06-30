import React from "react";
import { render, cleanup } from "@testing-library/react";

import Hint from "../hint.component";

import Strings from "../../../configuration/strings";

describe("Setup Environment", () => {
  let utils;

  beforeEach(() => {
    utils = render(
      <Hint>{Strings.Testing.GenericMultiLineTranslationTestString}</Hint>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message content", () => {
    const node = utils.getByTestId("HintDialogue");
    expect(node).toBeTruthy();
    expect(
      utils.getAllByText(Strings.Testing.GenericTranslationTestString).length
    ).toBe(2);
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container.firstChild).toMatchSnapshot();
  });
});
