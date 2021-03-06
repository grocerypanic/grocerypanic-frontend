import { render, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import Dialogue from "../../../components/dialogue/dialogue.component";
import FeedBack from "../../../components/feedback/feedback.component";
import Strings from "../../../configuration/strings";
import { propCount } from "../../../test.fixtures/objectComparison";
import AboutPage from "../about.page";

jest.mock("../../../components/dialogue/dialogue.component");
jest.mock("../../../components/feedback/feedback.component");
Dialogue.mockImplementation(() => <div>MockDialogue</div>);
FeedBack.mockImplementation(() => <div>MockFeedBack</div>);

describe("Check the correct props are passed to ", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(<AboutPage />);
  });

  afterEach(cleanup);

  it("should render the details page correctly", async () => {
    await waitFor(() => expect(Dialogue).toBeCalledTimes(1));
    const props = Dialogue.mock.calls[0][0];
    propCount(props, 4);

    expect(props.title).toBe(Strings.AboutPage.Title);
    expect(props.headerTitle).toBe(Strings.AboutPage.HeaderTitle);
    expect(props.body).toBe(Strings.AboutPage.Body);
    expect(props.Footer).toBe(FeedBack);
  });
});
