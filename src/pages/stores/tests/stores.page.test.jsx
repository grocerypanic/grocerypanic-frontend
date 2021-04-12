import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import StoresPage from "../stores.page";

import SimpleList from "../../../components/simple-list/simple-list.component";

import { StoreContext } from "../../../providers/api/store/store.provider";

import { SocialContext } from "../../../providers/social/social.provider";
import initialState from "../../../providers/social/social.initial";
import SocialActions from "../../../providers/social/social.actions";

import Strings from "../../../configuration/strings";

jest.mock("../../../components/simple-list/simple-list.component");
SimpleList.mockImplementation(() => <div>MockList</div>);

const mockDispatch = jest.fn();

describe("Check the correct props are passed to simple list", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <SocialContext.Provider
        value={{ socialLogin: initialState, dispatch: mockDispatch }}
      >
        <StoreContext.Provider>
          <StoresPage />
        </StoreContext.Provider>
      </SocialContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async () => {
    await waitFor(() => expect(SimpleList).toBeCalledTimes(1));
    const props = SimpleList.mock.calls[0][0];
    propCount(props, 7);

    expect(props.title).toBe(Strings.StorePage.Title);
    expect(props.headerTitle).toBe(Strings.StorePage.HeaderTitle);
    expect(props.ApiObjectContext).toBe(StoreContext);
    expect(props.handleExpiredAuth).toBeInstanceOf(Function);
    expect(props.helpText).toBe(Strings.StorePage.HelpText);
    expect(props.placeHolderMessage).toBe(Strings.StorePage.PlaceHolderMessage);
    expect(props.redirectTag).toBe("preferred_stores");

    expect(mockDispatch).toBeCalledTimes(0);
  });

  it("should handle an expired auth as expected", async () => {
    await waitFor(() => expect(SimpleList).toBeCalledTimes(1));
    const props = SimpleList.mock.calls[0][0];
    const handleExpiredAuth = props.handleExpiredAuth;

    act(() => handleExpiredAuth());

    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      payload: { username: "" },
      type: SocialActions.AuthExpired,
    });
  });
});
