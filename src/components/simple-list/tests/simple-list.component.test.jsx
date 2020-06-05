import React from "react";
import { render, cleanup, act, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import Header from "../../header/header.component";
import Help from "../../simple-list-help/simple-list-help.component";

import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import SimpleListItem from "../../simple-list-item/simple-list-item.component";
import SimpleList from "../simple-list.component";

import Strings from "../../../configuration/strings";

jest.mock("../../simple-list-item/simple-list-item.component");
jest.mock("../../header/header.component");
jest.mock("../../simple-list-help/simple-list-help.component");

SimpleListItem.mockImplementation(() => <div>MockListItem</div>);
Header.mockImplementation(() => <div>MockHeader</div>);
Help.mockImplementation(() => <div>MockHelp</div>);
const mockDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();

// Mock Api Data
const mockData = [
  { id: 1, name: "Shelf1" },
  { id: 2, name: "Shelf2" },
  { id: 3, name: "Shelf3" },
];
const mockDataState = {
  transaction: false,
  error: false,
  errorMsg: null,
};

const mockPlaceHolderMessage = "I'm Right Here";

describe("Setup Environment", () => {
  let tests = [
    { transaction: false },
    { transaction: false },
    { transaction: false },
    { transaction: false },
    { transaction: false },
    { transaction: false },
    { transaction: false },
    { transaction: true },
    { transaction: false },
    { transaction: true },
    { transaction: false },
    { transaction: true },
    { transaction: false, inventory: [] },
    { transaction: false },
  ];
  let utils;
  let current;
  const mockTitle = "Some Title";
  const mockHeaderTitle = "Some Header Title";
  const create = jest.fn();
  let ApiContext;
  let ApiProvider;
  let apiObjectState;

  beforeEach(() => {
    current = tests.shift();
    jest.clearAllMocks();

    apiObjectState = {
      inventory: mockData,
      ...mockDataState,
      ...current,
    };

    ApiContext = React.createContext({
      apiObject: apiObjectState,
      dispatch: mockDispatch,
    });

    ApiProvider = ({ children }) => {
      return (
        <ApiContext.Provider
          value={{
            apiObject: apiObjectState,
            dispatch: mockDispatch,
          }}
        >
          {children}
        </ApiContext.Provider>
      );
    };
    utils = render(
      <ApiProvider>
        <SimpleList
          title={mockTitle}
          headerTitle={mockHeaderTitle}
          create={create}
          transaction={current.transaction}
          ApiObjectContext={ApiContext}
          placeHolderMessage={mockPlaceHolderMessage}
          handleExpiredAuth={mockHandleExpiredAuth}
          helpText={Strings.GenericTranslationTestString}
        />
        }}
      </ApiProvider>
    );
  });

  afterEach(cleanup);

  const validateFunctions = (call) => {
    expect(call.listFunctions.setSelected).toBeInstanceOf(Function);
    expect(call.listFunctions.setErrorMsg).toBeInstanceOf(Function);
    expect(call.listFunctions.setCreated).toBeInstanceOf(Function);
    expect(call.listFunctions.setLongPress).toBeInstanceOf(Function);
    expect(call.listFunctions.add).toBeInstanceOf(Function);
    expect(call.listFunctions.del).toBeInstanceOf(Function);

    expect(call.listFunctions.setErrorMsg.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setSelected.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setCreated.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setLongPress.name).toBe("bound dispatchAction");
    expect(call.listFunctions.add.name).toBe("handleSave");
    expect(call.listFunctions.del.name).toBe("handleDelete");
  };

  it("renders, outside of a transaction should call header with the correct params", () => {
    expect(current.transaction).toBe(false);

    expect(Header).toHaveBeenCalledTimes(1);

    const headerCall = Header.mock.calls[0][0];
    propCount(headerCall, 3);
    expect(headerCall.title).toBe(mockHeaderTitle);
    expect(headerCall.transaction).toBe(current.transaction);

    expect(headerCall.create).toBeInstanceOf(Function);
    expect(headerCall.create.name).toBe("handleCreate");
  });

  it("renders, outside of a transaction should call help with the correct params", () => {
    expect(current.transaction).toBe(false);

    expect(Help).toHaveBeenCalledTimes(1);

    const helpCall = Help.mock.calls[0][0];
    propCount(helpCall, 1);
    expect(helpCall.children).toBe(Strings.GenericTranslationTestString);
  });

  it("renders, outside of a transaction should call the simple list component(s) with the correct params", () => {
    expect(current.transaction).toBe(false);

    expect(SimpleListItem).toHaveBeenCalledTimes(3);

    const call1 = SimpleListItem.mock.calls[0][0];
    propCount(call1, 4);
    propCount(call1.listFunctions, 6);
    propCount(call1.listValues, 4);

    expect(call1.item).toBe(mockData[0]);
    expect(call1.allItems).toBe(mockData);

    expect(call1.listValues.selected).toBe(null);
    expect(call1.listValues.errorMsg).toBe(null);
    expect(call1.listValues.transaction).toBe(false);
    expect(call1.listValues.longPress).toBe(false);

    validateFunctions(call1);

    const call2 = SimpleListItem.mock.calls[1][0];
    propCount(call1, 4);
    propCount(call1.listFunctions, 6);
    propCount(call1.listValues, 4);

    expect(call2.item).toBe(mockData[1]);
    expect(call2.allItems).toBe(mockData);

    expect(call2.listValues.selected).toBe(null);
    expect(call2.listValues.errorMsg).toBe(null);
    expect(call2.listValues.transaction).toBe(false);
    expect(call2.listValues.longPress).toBe(false);

    validateFunctions(call2);

    const call3 = SimpleListItem.mock.calls[2][0];
    propCount(call1, 4);
    propCount(call1.listFunctions, 6);
    propCount(call1.listValues, 4);

    expect(call3.item).toBe(mockData[2]);
    expect(call3.allItems).toBe(mockData);

    expect(call3.listValues.selected).toBe(null);
    expect(call3.listValues.errorMsg).toBe(null);
    expect(call3.listValues.transaction).toBe(false);
    expect(call3.listValues.longPress).toBe(false);

    validateFunctions(call3);
  });

  it("renders, there should be no error message rendered", () => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { errorMsg } = SimpleListItem.mock.calls[0][0].listValues;
    expect(utils.getByText(mockTitle)).toBeTruthy();
    expect(errorMsg).toBeNull();
  });

  it("renders, when an error occurs during a create, it's rendered", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);

    const {
      setCreated,
      setErrorMsg,
    } = SimpleListItem.mock.calls[0][0].listFunctions;
    SimpleListItem.mockClear(); // Prepare for rerender, so we can count again

    act(() => {
      setErrorMsg("Error");
      setCreated(true);
    });
    await waitFor(() =>
      expect(utils.queryByText(mockTitle)).not.toBeInTheDocument()
    );
    expect(utils.getByText("Error")).toBeTruthy();

    // An Extra Simple List Item should now be rendered for the created item
    expect(SimpleListItem).toHaveBeenCalledTimes(4);

    done();
  });

  it("renders, calls StartList on first render", async (done) => {
    expect(current.transaction).toBeFalsy();
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
    const call = mockDispatch.mock.calls[0][0];
    expect(call.type).toBe(ApiActions.StartList);
    expect(call.func).toBe(ApiFunctions.asyncList);
    expect(call.dispatch).toBeInstanceOf(Function);
    done();
  });

  it("renders, when handleCreate is called, it creates a new object", async (done) => {
    expect(Header).toHaveBeenCalledTimes(1);
    const { create } = Header.mock.calls[0][0];
    expect(current.transaction).toBeFalsy();

    SimpleListItem.mockClear(); // rerender
    act(() => {
      create();
    });

    await waitFor(() => expect(SimpleListItem).toHaveBeenCalledTimes(4));
    const { item } = SimpleListItem.mock.calls[3][0];
    const { selected } = SimpleListItem.mock.calls[3][0].listValues;
    expect(item).toStrictEqual({ id: -1, name: "" });
    expect(selected).toBe(-1);
    done();
  });

  it("renders, and then when there is an transaction bypasses calls to handleCreate", async (done) => {
    expect(Header).toHaveBeenCalledTimes(1);
    const { create } = Header.mock.calls[0][0];
    expect(current.transaction).toBeTruthy();

    SimpleListItem.mockClear(); // no changes, no rerender
    act(() => {
      create();
    });

    expect(SimpleListItem).toHaveBeenCalledTimes(0);
    done();
  });

  it("renders, and dispatches the API reducer when handleSave is called", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { add } = SimpleListItem.mock.calls[0][0].listFunctions;
    expect(current.transaction).toBeFalsy();

    act(() => {
      add("shelfname");
    });

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(2));
    expect(mockDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);

    const apiCall = mockDispatch.mock.calls[1][0];
    expect(apiCall.type).toBe(ApiActions.StartAdd);
    expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
    expect(apiCall.payload).toStrictEqual({ name: "shelfname" });
    done();
  });

  it("renders, and then when there is an transaction bypasses calls to handleSave", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { add } = SimpleListItem.mock.calls[0][0].listFunctions;
    expect(current.transaction).toBeTruthy();

    SimpleListItem.mockClear(); // no changes, no rerender
    act(() => {
      add("name");
    });

    expect(SimpleListItem).toHaveBeenCalledTimes(0);
    // MockDispatch only has a call for the initial item listing, not for the add
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);
    done();
  });

  it("renders,  and dispatches the API reducer when handleDelete is called", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { del } = SimpleListItem.mock.calls[0][0].listFunctions;
    expect(current.transaction).toBeFalsy();

    act(() => {
      del(2);
    });

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(2));
    expect(mockDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);

    const apiCall = mockDispatch.mock.calls[1][0];
    expect(apiCall.type).toBe(ApiActions.StartDel);
    expect(apiCall.func).toBe(ApiFunctions.asyncDel);
    expect(apiCall.payload.id).toBe(2);
    done();
  });

  it("renders, and then when there is an transaction bypasses calls to handleDelete", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { del } = SimpleListItem.mock.calls[0][0].listFunctions;
    expect(current.transaction).toBeTruthy();

    SimpleListItem.mockClear(); // no changes, no rerender
    act(() => {
      del(2);
    });

    expect(SimpleListItem).toHaveBeenCalledTimes(0);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);

    done();
  });

  it("renders, outside of a transaction, with no items in the list, and renders the mockPlaceHolderMessage", () => {
    expect(current.transaction).toBe(false);

    expect(Header).toHaveBeenCalledTimes(1);
    expect(SimpleListItem).toBeCalledTimes(0);
    expect(utils.getByText(mockPlaceHolderMessage)).toBeTruthy();
  });

  it("renders,  and handles an auth failure condition as expected", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { del } = SimpleListItem.mock.calls[0][0].listFunctions;
    expect(current.transaction).toBeFalsy();

    act(() => {
      del(2);
    });

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(2));
    expect(mockDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);

    const apiCall = mockDispatch.mock.calls[1][0];
    const setPerformAsync = apiCall.dispatch;

    act(() => {
      setPerformAsync({ type: ApiActions.FailureAuth });
    });

    await waitFor(() => expect(mockHandleExpiredAuth).toHaveBeenCalledTimes(1));

    done();
  });
});
