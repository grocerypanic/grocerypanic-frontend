import { render, cleanup, waitFor, act } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import ItemDetailsCreateContainer from "../../../components/item-details/item-details.create/item-details.create.container";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import { ItemContext } from "../../../providers/api/item/item.provider";
import SocialActions from "../../../providers/social/social.actions";
import initialState from "../../../providers/social/social.initial";
import { SocialContext } from "../../../providers/social/social.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import ItemCreatePage from "../create.page";

jest.mock(
  "../../../components/item-details/item-details.create/item-details.create.container"
);
ItemDetailsCreateContainer.mockImplementation(() => <div>MockDetails</div>);

const mockDispatch = jest.fn();
const ItemId = "1";

describe("Check the correct props are passed to simple list", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <SocialContext.Provider
        value={{ socialLogin: initialState, dispatch: mockDispatch }}
      >
        <MemoryRouter initialEntries={[Routes.details.replace(":id", ItemId)]}>
          <ItemContext.Provider>
            <Route path={Routes.details} component={ItemCreatePage} />
          </ItemContext.Provider>
        </MemoryRouter>
      </SocialContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the details page correctly", async () => {
    await waitFor(() => expect(ItemDetailsCreateContainer).toBeCalledTimes(1));
    const props = ItemDetailsCreateContainer.mock.calls[0][0];
    propCount(props, 5);

    expect(props.title).toBe(Strings.CreateItem.Title);
    expect(props.headerTitle).toBe(Strings.CreateItem.HeaderTitle);
    expect(props.ApiObjectContext).toBe(ItemContext);
    expect(props.handleExpiredAuth).toBeInstanceOf(Function);
    expect(props.helpText).toBe(Strings.CreateItem.HelpText);
  });

  it("should handle an expired auth as expected", async () => {
    await waitFor(() => expect(ItemDetailsCreateContainer).toBeCalledTimes(1));
    const props = ItemDetailsCreateContainer.mock.calls[0][0];
    const handleExpiredAuth = props.handleExpiredAuth;

    act(() => handleExpiredAuth());

    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      payload: { username: "" },
      type: SocialActions.AuthExpired,
    });
  });
});
