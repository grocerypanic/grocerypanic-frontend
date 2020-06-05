import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ItemPage from "../items.page";

//import ItemList from "../../../components/simple-list/simple-list.component";

import { StoreContext } from "../../../providers/api/store/store.provider";

import { UserContext } from "../../../providers/user/user.provider";
import initialState from "../../../providers/user/user.initial";
import UserActions from "../../../providers/user/user.actions";

import Strings from "../../../configuration/strings";

// jest.mock("../../../components/simple-list/simple-list.component");
const ItemList = jest.fn();
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
        <StoreContext.Provider>
          <ItemPage />
        </StoreContext.Provider>
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async (done) => {
    await waitFor(() => expect(ItemList).toBeCalledTimes(1));
    const props = ItemList.mock.calls[0][0];
    propCount(props, 0);

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
