import React from "react";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Copyright from "../copyright.component";

import Strings from "../../../configuration/strings";
import Routes from "../../../configuration/routes";
import Assets from "../../../configuration/assets";

// Freeze Time
Date.now = jest.fn(() => new Date("2019-06-16T11:01:58.135Z"));

describe("Setup Environment", () => {
  let utils;
  const year = "2019";

  beforeEach(() => {
    utils = render(
      <MemoryRouter initialEntries={["/anything"]}>
        <Copyright />
      </MemoryRouter>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message content", () => {
    const node = utils.getByTestId("CopyRight");
    expect(node).toBeTruthy();
    const [declaration, link, space, yearEnding] = Array.from(node.childNodes);
    expect(declaration.textContent).toBe(Strings.Copyight.CopyrightDeclaration);
    expect(link.textContent).toBe(`${Strings.Copyight.CopyrightMessage}`);
    expect(link.getAttribute("href")).toEqual(Routes.menu);
    expect(space.textContent).toBe(`${Assets.nonBreakingSpace}`);
    expect(yearEnding.textContent).toBe(`${year}.`);
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container.firstChild).toMatchSnapshot();
  });
});
