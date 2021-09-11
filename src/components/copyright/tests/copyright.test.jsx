import { render, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Assets from "../../../configuration/assets";
import { External } from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import Copyright from "../copyright.component";

// Freeze Time
Date.now = jest.fn(() => new Date("2019-06-16T11:01:58.135Z"));

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

describe("Setup Environment", () => {
  let utils;
  const year = "2019";

  beforeEach(() => {
    utils = render(
      <AnalyticsContext.Provider value={mockAnalyticsContext}>
        <MemoryRouter initialEntries={["/anything"]}>
          <Copyright />
        </MemoryRouter>
      </AnalyticsContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message content", () => {
    const node = utils.getByTestId("CopyRight");
    expect(node).toBeTruthy();
    const [declaration, link, space, yearEnding] = Array.from(node.childNodes);
    expect(declaration.textContent).toBe(
      Strings.Copyright.CopyrightDeclaration
    );
    expect(link.textContent).toBe(`${Strings.Copyright.CopyrightMessage}`);
    expect(link.getAttribute("href")).toEqual(External.credit);
    expect(space.textContent).toBe(`${Assets.nonBreakingSpace}`);
    expect(yearEnding.textContent).toBe(`${year}.`);
  });

  it("should render with the correct external link", () => {
    const node = utils.getByTestId("CopyRightLink");
    expect(node.getAttribute("href")).toEqual(External.credit);
  });

  it("should handle a click on the link correctly", (done) => {
    const node = utils.getByTestId("CopyRightLink");
    fireEvent.click(node, "click");
    expect(mockAnalyticsContext.event).toBeCalledWith(
      AnalyticsActions.HomePageLink
    );
    done();
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container.firstChild).toMatchSnapshot();
  });
});
