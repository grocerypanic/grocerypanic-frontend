import React from "react";
import { render, cleanup } from "@testing-library/react";

import FeedBack from "../feedback.component";

import Strings from "../../../configuration/strings";
import { External } from "../../../configuration/routes";

describe("Setup Environment", () => {
  let utils;

  beforeEach(() => {
    utils = render(<FeedBack />);
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
});
