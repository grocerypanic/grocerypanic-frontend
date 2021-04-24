import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ProfilePage from "../profile.page";
import UserProfileEditContainer from "../../../components/profile/profile.edit.container";

import Strings from "../../../configuration/strings";
import Options from "../../../configuration/menu";

jest.mock("../../../components/profile/profile.edit.container");
UserProfileEditContainer.mockImplementation(() => <div>MockProfileEditor</div>);

const mockDispatch = jest.fn();

describe("Check the profile page is rendered correctly", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ProfilePage />);
  });

  afterEach(cleanup);

  it("should render the profile component with the correct props", async () => {
    await waitFor(() => expect(UserProfileEditContainer).toBeCalledTimes(1));
    const props = UserProfileEditContainer.mock.calls[0][0];
    propCount(props, 4);

    expect(props.title).toBe(Strings.Profile.Title);
    expect(props.headerTitle).toBe(Strings.Profile.HeaderTitle);
    expect(props.options).toBe(Options);
    expect(props.helpText).toBe(Strings.Profile.HelpText);

    expect(mockDispatch).toBeCalledTimes(0);
  });
});
