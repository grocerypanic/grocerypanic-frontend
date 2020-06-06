import React from "react";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Copyright from "../copyright.component";

import Strings from "../../../configuration/strings";
import Routes from "../../../configuration/routes";
import Assets from "../../../configuration/assets";

describe("Setup Environment", () => {
  let tests = [1];
  let utils;
  let currentTest;
  const year = new Date().getFullYear();

  beforeEach(() => {
    currentTest = tests.shift();
    utils = render(
      <MemoryRouter initialEntries={["/anything"]}>
        <Copyright />
      </MemoryRouter>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message content", () => {
    expect(currentTest).toBe(1);
    const node = utils.getByTestId("CopyRight");
    expect(node).toBeTruthy();
    const [declaration, link, space, yearEnding] = Array.from(node.childNodes);
    expect(declaration.textContent).toBe(Strings.Copyight.CopyrightDeclaration);
    expect(link.textContent).toBe(`${Strings.Copyight.CopyrightMessage}`);
    expect(link.getAttribute("href")).toEqual(Routes.root);
    expect(space.textContent).toBe(`${Assets.nonBreakingSpace}`);
    expect(yearEnding.textContent).toBe(`${year}.`);
  });
});
