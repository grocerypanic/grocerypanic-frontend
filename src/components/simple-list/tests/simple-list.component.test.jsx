import React from "react";
import { render, cleanup, act, waitFor } from "@testing-library/react";

import Header from "../../header/header.component";

import ApiActions from "../../../providers/api/api.actions";

import SimpleListItem from "../../simple-list-item/simple-list-item.component";
import SimpleList from "../simple-list.component";

jest.mock("../../simple-list-item/simple-list-item.component");
jest.mock("../../header/header.component");

SimpleListItem.mockImplementation(() => <div>MockListItem</div>);
Header.mockImplementation(() => <div>MockHeader</div>);
const mockDispatch = jest.fn();

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

describe("Setup Environment", () => {
  let tests = [
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
        />
        }}
      </ApiProvider>
    );
  });

  afterEach(cleanup);

  it("renders, outside of a transaction should call the header with the correct params", () => {
    expect(current.transaction).toBe(false);

    expect(Header).toHaveBeenCalledTimes(1);

    const headerCall = Header.mock.calls[0][0];
    expect(headerCall.title).toBe(mockHeaderTitle);
    expect(headerCall.transaction).toBe(current.transaction);
    expect(headerCall.create).toBeInstanceOf(Function);
    expect(headerCall.create.name).toBe("handleCreate");
  });

  it("renders, outside of a transaction should call the simple list component(s) with the correct params", () => {
    expect(current.transaction).toBe(false);

    expect(SimpleListItem).toHaveBeenCalledTimes(3);

    const call1 = SimpleListItem.mock.calls[0][0];
    expect(call1.selected).toBe(null);
    expect(call1.setSelected).toBeInstanceOf(Function);
    expect(call1.setErrorMsg).toBeInstanceOf(Function);
    expect(call1.allItems).toBe(mockData);
    expect(call1.add).toBeInstanceOf(Function);
    expect(call1.add.name).toBe("handleSave");
    expect(call1.del).toBeInstanceOf(Function);
    expect(call1.del.name).toBe("handleDelete");
    expect(call1.errorMsg).toBe(null);
    expect(call1.item).toBe(mockData[0]);
    expect(call1.transaction).toBe(false);

    const call2 = SimpleListItem.mock.calls[1][0];
    expect(call2.selected).toBe(null);
    expect(call2.setSelected).toBeInstanceOf(Function);
    expect(call2.setErrorMsg).toBeInstanceOf(Function);
    expect(call2.allItems).toBe(mockData);
    expect(call2.add).toBeInstanceOf(Function);
    expect(call2.add.name).toBe("handleSave");
    expect(call2.del).toBeInstanceOf(Function);
    expect(call2.del.name).toBe("handleDelete");
    expect(call2.errorMsg).toBe(null);
    expect(call2.item).toBe(mockData[1]);
    expect(call2.transaction).toBe(false);

    const call3 = SimpleListItem.mock.calls[2][0];
    expect(call3.selected).toBe(null);
    expect(call3.setSelected).toBeInstanceOf(Function);
    expect(call3.setErrorMsg).toBeInstanceOf(Function);
    expect(call3.allItems).toBe(mockData);
    expect(call3.add).toBeInstanceOf(Function);
    expect(call3.add.name).toBe("handleSave");
    expect(call3.del).toBeInstanceOf(Function);
    expect(call3.del.name).toBe("handleDelete");
    expect(call3.errorMsg).toBe(null);
    expect(call3.item).toBe(mockData[2]);
    expect(call3.transaction).toBe(false);
  });

  it("renders, there should be no error message rendered", () => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { errorMsg } = SimpleListItem.mock.calls[0][0];
    expect(utils.getByText(mockTitle)).toBeTruthy();
    expect(errorMsg).toBeNull();
  });

  it("renders, when an error occurs during a create, it's rendered", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);

    const { setCreated, setErrorMsg } = SimpleListItem.mock.calls[0][0];
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

  it("renders, when handleCreate is called, it creates a new object", async (done) => {
    expect(Header).toHaveBeenCalledTimes(1);
    const { create } = Header.mock.calls[0][0];
    expect(current.transaction).toBeFalsy();

    SimpleListItem.mockClear(); // rerender
    act(() => {
      create();
    });

    await waitFor(() => expect(SimpleListItem).toHaveBeenCalledTimes(4));
    const { item, selected } = SimpleListItem.mock.calls[3][0];
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
    const { add } = SimpleListItem.mock.calls[0][0];
    expect(current.transaction).toBeFalsy();

    act(() => {
      add();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const apiCall = mockDispatch.mock.calls[0][0];
    expect(apiCall.type).toBe(ApiActions.StartAdd);
    fail("Not yet implemented.");
    expect(apiCall.func).toBeInstance(Function);
    done();
  });

  it("renders, and then when there is an transaction bypasses calls to handleSave", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { add } = SimpleListItem.mock.calls[0][0];
    expect(current.transaction).toBeTruthy();

    SimpleListItem.mockClear(); // no changes, no rerender
    act(() => {
      add();
    });

    expect(SimpleListItem).toHaveBeenCalledTimes(0);
    expect(mockDispatch).toHaveBeenCalledTimes(0);
    done();
  });

  it("renders,  and dispatches the API reducer when handleDelete is called", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { del } = SimpleListItem.mock.calls[0][0];
    expect(current.transaction).toBeFalsy();

    act(() => {
      del();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const apiCall = mockDispatch.mock.calls[0][0];
    expect(apiCall.type).toBe(ApiActions.StartDel);
    fail("Not yet implemented.");
    expect(apiCall.func).toBeInstance(Function);
    done();
  });

  it("renders, and then when there is an transaction bypasses calls to handleDelete", async (done) => {
    expect(SimpleListItem).toHaveBeenCalledTimes(3);
    const { del } = SimpleListItem.mock.calls[0][0];
    expect(current.transaction).toBeTruthy();

    SimpleListItem.mockClear(); // no changes, no rerender
    act(() => {
      del();
    });

    expect(SimpleListItem).toHaveBeenCalledTimes(0);
    expect(mockDispatch).toHaveBeenCalledTimes(0);
    done();
  });
});
