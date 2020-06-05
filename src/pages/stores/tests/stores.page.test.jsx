import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import StoresPage from "../stores.page";

import SimpleList from "../../../components/simple-list/simple-list.component";

import { StoreContext } from "../../../providers/api/store/store.provider";

import { UserContext } from "../../../providers/user/user.provider";
import initialState from "../../../providers/user/user.initial";
import UserActions from "../../../providers/user/user.actions";

import Strings from "../../../configuration/strings";

jest.mock("../../../components/simple-list/simple-list.component");
SimpleList.mockImplementation(() => <div>MockList</div>);

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
          <StoresPage />
        </StoreContext.Provider>
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async (done) => {
    await waitFor(() => expect(SimpleList).toBeCalledTimes(1));
    const props = SimpleList.mock.calls[0][0];
    propCount(props, 6);

    expect(props.title).toBe(Strings.StorePageTitle);
    expect(props.headerTitle).toBe(Strings.StorePageHeaderTitle);
    expect(props.ApiObjectContext).toBe(StoreContext);
    expect(props.handleExpiredAuth).toBeInstanceOf(Function);
    expect(props.helpText).toBe(Strings.StoreHelpText);

    expect(mockDispatch).toBeCalledTimes(0);
    done();
  });

  it("should handle an expired auth as expected", async (done) => {
    await waitFor(() => expect(SimpleList).toBeCalledTimes(1));
    const props = SimpleList.mock.calls[0][0];
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
