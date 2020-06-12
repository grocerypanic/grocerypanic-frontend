import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ItemPage from "../items.page";

import ItemList from "../../../components/item-list/item-list.component";

import { ItemContext } from "../../../providers/api/item/item.provider";

import { UserContext } from "../../../providers/user/user.provider";
import initialState from "../../../providers/user/user.initial";
import UserActions from "../../../providers/user/user.actions";

import Strings from "../../../configuration/strings";

jest.mock("../../../components/item-list/item-list.component");
ItemList.mockImplementation(() => <div>MockList</div>);

const mockDispatch = jest.fn();

describe("Check the correct props are passed to simple list", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();

    currentTest = tests.shift();
    utils = render(
      <UserContext.Provider
        value={{ user: initialState, dispatch: mockDispatch }}
      >
        <ItemContext.Provider>
          <ItemPage />
        </ItemContext.Provider>
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async (done) => {
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
    done();
  });

  it("should handle an expired auth as expected", async (done) => {
    await waitFor(() => expect(ItemList).toBeCalledTimes(1));
    const props = ItemList.mock.calls[0][0];
    const handleExpiredAuth = props.handleExpiredAuth;

    act(() => handleExpiredAuth());

    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      payload: { username: "" },
      type: UserActions.AuthExpired,
    });
    done();
  });
});
