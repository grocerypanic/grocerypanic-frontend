import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ItemPage from "../items.page";

import ItemList from "../../../components/item-list/item-list.component";

import { ItemContext } from "../../../providers/api/item/item.provider";

import { SocialContext } from "../../../providers/social/social.provider";
import initialState from "../../../providers/social/social.initial";
import SocialActions from "../../../providers/social/social.actions";

import Strings from "../../../configuration/strings";

jest.mock("../../../components/item-list/item-list.component");
ItemList.mockImplementation(() => <div>MockList</div>);

const mockDispatch = jest.fn();

describe("Check the correct props are passed to simple list", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <SocialContext.Provider
        value={{ socialLogin: initialState, dispatch: mockDispatch }}
      >
        <ItemContext.Provider>
          <ItemPage />
        </ItemContext.Provider>
      </SocialContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async () => {
    await waitFor(() => expect(ItemList).toBeCalledTimes(1));
    const props = ItemList.mock.calls[0][0];
    propCount(props, 6);

    expect(props.title).toBe(Strings.InventoryPage.Title);
    expect(props.headerTitle).toBe(Strings.InventoryPage.HeaderTitle);
    expect(props.ApiObjectContext).toBe(ItemContext);
    expect(props.handleExpiredAuth).toBeInstanceOf(Function);
    expect(props.helpText).toBe(Strings.InventoryPage.HelpText);
    expect(props.placeHolderMessage).toBe(
      Strings.InventoryPage.PlaceHolderMessage
    );
  });

  it("should handle an expired auth as expected", async () => {
    await waitFor(() => expect(ItemList).toBeCalledTimes(1));
    const props = ItemList.mock.calls[0][0];
    const handleExpiredAuth = props.handleExpiredAuth;

    act(() => handleExpiredAuth());

    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      payload: { username: "" },
      type: SocialActions.AuthExpired,
    });
  });
});
