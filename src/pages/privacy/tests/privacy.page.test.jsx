import { render, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import Dialogue from "../../../components/dialogue/dialogue.component";
import FeedBack from "../../../components/feedback/feedback.component";
import Strings from "../../../configuration/strings";
import { propCount } from "../../../test.fixtures/objectComparison";
import PrivacyPage from "../privacy.page";

const mockFetch = jest.fn();
jest.mock("../../../components/dialogue/dialogue.component");
jest.mock("../../../components/feedback/feedback.component");
Dialogue.mockImplementation((props) => <div>{props.Body}</div>);
FeedBack.mockImplementation(() => <div>MockFeedBack</div>);

global.fetch = mockFetch;

describe("Check the correct props are passed to ", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    mockFetch.mockImplementation(() =>
      Promise.resolve({
        text: () => Promise.resolve("hello"),
      })
    );

    await act(async () => {
      render(<PrivacyPage />);
    });
  });

  afterEach(cleanup);

  it("should render the details page correctly", async () => {
    await waitFor(() => expect(mockFetch).toBeCalledTimes(1));
    await waitFor(() => expect(Dialogue).toBeCalledTimes(2));
    const props = Dialogue.mock.calls[1][0];
    propCount(props, 4);
    expect(props.title).toBe(Strings.PrivacyPage.Title);
    expect(props.headerTitle).toBe(Strings.PrivacyPage.HeaderTitle);
    expect(props.Footer).toBe(FeedBack);
    expect(props.body).toBe("hello");
  });
});
