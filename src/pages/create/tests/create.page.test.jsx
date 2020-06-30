import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import { MemoryRouter, Route } from "react-router-dom";

import ItemCreatePage from "../create.page";
import ItemDetailsCreateContainer from "../../../components/item-details/item-details.create.container";

import { ItemContext } from "../../../providers/api/item/item.provider";

import { UserContext } from "../../../providers/user/user.provider";
import initialState from "../../../providers/user/user.initial";
import UserActions from "../../../providers/user/user.actions";

import Strings from "../../../configuration/strings";
import Routes from "../../../configuration/routes";

jest.mock("../../../components/item-details/item-details.create.container");
ItemDetailsCreateContainer.mockImplementation(() => <div>MockDetails</div>);

const mockDispatch = jest.fn();
const ItemId = "1";

describe("Check the correct props are passed to simple list", () => {
  let utils;

  beforeEach(() => {
    jest.clearAllMocks();
    const match = { params: { id: ItemId } };

    utils = render(
      <UserContext.Provider
        value={{ user: initialState, dispatch: mockDispatch }}
      >
        <MemoryRouter initialEntries={[Routes.details.replace(":id", ItemId)]}>
          <ItemContext.Provider>
            <Route path={Routes.details} component={ItemCreatePage} />
          </ItemContext.Provider>
        </MemoryRouter>
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the details page correctly", async (done) => {
    await waitFor(() => expect(ItemDetailsCreateContainer).toBeCalledTimes(1));
    const props = ItemDetailsCreateContainer.mock.calls[0][0];
    propCount(props, 5);

    expect(props.title).toBe(Strings.CreateItem.Title);
    expect(props.headerTitle).toBe(Strings.CreateItem.HeaderTitle);
    expect(props.ApiObjectContext).toBe(ItemContext);
    expect(props.handleExpiredAuth).toBeInstanceOf(Function);
    expect(props.helpText).toBe(Strings.CreateItem.HelpText);

    done();
  });

  it("should handle an expired auth as expected", async (done) => {
    await waitFor(() => expect(ItemDetailsCreateContainer).toBeCalledTimes(1));
    const props = ItemDetailsCreateContainer.mock.calls[0][0];
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
