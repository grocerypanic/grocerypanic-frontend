import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import FeedBack from "../feedback.component";

import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";

import Strings from "../../../configuration/strings";
import { External } from "../../../configuration/routes";

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

describe("Setup Environment", () => {
  let utils;

  beforeEach(() => {
    utils = render(
      <AnalyticsContext.Provider value={mockAnalyticsContext}>
        <FeedBack />
      </AnalyticsContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message content", () => {
    expect(utils.getByTestId("FeedBack")).toBeTruthy();
    expect(utils.getByText(Strings.FeedBack.Request1)).toBeTruthy();
  });
  it("should render with the correct external link", () => {
    const node = utils.getByTestId("FeedBackLink");
    const [text2, link, text3] = Array.from(node.childNodes);
    expect(text2.textContent).toBe(Strings.FeedBack.Request2);
    expect(link.getAttribute("href")).toEqual(External.feedback);
    expect(link.textContent).toBe(`${Strings.FeedBack.Link}`);
    expect(text3.textContent).toBe(Strings.FeedBack.Request3);
  });

  it("should handle a click on the link correctly", (done) => {
    const node = utils.getByTestId("FeedBackLink");
    const [, link] = Array.from(node.childNodes);
    fireEvent.click(link, "click");
    expect(mockAnalyticsContext.event).toBeCalledWith(
      AnalyticsActions.FeedBackLink
    );
    done();
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container.firstChild).toMatchSnapshot();
  });
});
