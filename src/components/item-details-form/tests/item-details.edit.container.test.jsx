import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import { MemoryRouter, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import ItemDetails from "../item-details.form";
import ItemDetailsContainer from "../item-details.edit.container";

import { ItemContext } from "../../../providers/api/item/item.provider";
import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../../providers/api/store/store.provider";

import InitialValue from "../../../providers/api/item/item.initial";
import ShelfInitialValue from "../../../providers/api/shelf/shelf.initial";
import StoreInitialValue from "../../../providers/api/store/store.initial";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import Strings from "../../../configuration/strings";

jest.mock("../item-details.form");
jest.mock("../../holding-pattern/holding-pattern.component");

ItemDetails.mockImplementation(() => <div>MockDetails</div>);
HoldingPattern.mockImplementation(({ children }) => children);

const mockItemDispatch = jest.fn();
const mockStoreDispatch = jest.fn();
const mockShelfDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();
const mockGoBack = jest.fn();

const mockItem = {
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: "2020-06-15",
  next_expiry_quantity: 0,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf: 2,
  shelf_life: 25,
};

const mockShelf = {
  id: 1,
  name: "Fridge",
};

const mockStore = {
  id: 1,
  name: "No Frills",
};

const mockItemsProvider = {
  dispatch: mockItemDispatch,
  apiObject: { ...InitialValue, inventory: [mockItem] },
};

const mockStoreProvider = {
  dispatch: mockStoreDispatch,
  apiObject: { ...StoreInitialValue, inventory: [mockStore] },
};

const mockShelfProvider = {
  dispatch: mockShelfDispatch,
  apiObject: { ...ShelfInitialValue, inventory: [mockShelf] },
};

const props = {
  itemId: "1",
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  handleExpiredAuth: mockHandleExpiredAuth,
  helpText: Strings.Testing.GenericTranslationTestString,
  FormComponent: ItemDetails,
};

describe("Setup Environment", () => {
  let utils;
  let current;
  let originalPath = "/some/unmatched/path";
  let newPath = "/newPath";

  beforeEach(() => {
    current = { ...props };
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("when item exists", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      const history = createBrowserHistory();
      history.location.pathname = originalPath;
      history.goBack = mockGoBack;

      utils = render(
        <Router history={history}>
          <StoreContext.Provider
            value={{ ...mockStoreProvider, transaction: false }}
          >
            <ShelfContext.Provider
              value={{ ...mockShelfProvider, transaction: false }}
            >
              <ItemContext.Provider
                value={{
                  ...mockItemsProvider,
                  transaction: false,
                }}
              >
                <ItemDetailsContainer {...current} />
              </ItemContext.Provider>
            </ShelfContext.Provider>
          </StoreContext.Provider>
        </Router>
      );
    });

    it("renders, bypasses HoldingPattern as expected", async (done) => {
      await waitFor(() => expect(HoldingPattern).toHaveBeenCalledTimes(3));
      const call = HoldingPattern.mock.calls[0][0];
      propCount(call, 2);
      expect(call.condition).toBe(true);
      done();
    });

    it("renders, calls items.StartGet on first render", async (done) => {
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      const call = mockItemDispatch.mock.calls[0][0];
      propCount(call, 4);
      expect(call.type).toBe(ApiActions.StartGet);
      expect(call.func).toBe(ApiFunctions.asyncGet);
      expect(call.dispatch).toBeInstanceOf(Function);
      expect(call.payload).toStrictEqual({ id: props.itemId });
      done();
    });

    it("renders, calls items auth failure as expected", async (done) => {
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      const itemDispatch = mockItemDispatch.mock.calls[0][0].dispatch;

      expect(mockHandleExpiredAuth).toBeCalledTimes(0);
      act(() => itemDispatch({ type: ApiActions.FailureAuth }));
      await expect(mockHandleExpiredAuth).toBeCalledTimes(1);

      done();
    });

    it("renders, calls shelves.StartList on first render", async (done) => {
      await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
      const call = mockShelfDispatch.mock.calls[0][0];
      propCount(call, 3);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      done();
    });

    it("renders, calls shelves auth failure as expected", async (done) => {
      await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
      const shelfDispatch = mockShelfDispatch.mock.calls[0][0].dispatch;

      expect(mockHandleExpiredAuth).toBeCalledTimes(0);
      act(() => shelfDispatch({ type: ApiActions.FailureAuth }));
      await expect(mockHandleExpiredAuth).toBeCalledTimes(1);

      done();
    });

    it("renders, calls stores.StartList on first render", async (done) => {
      await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));
      const call = mockStoreDispatch.mock.calls[0][0];
      propCount(call, 3);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      done();
    });

    it("renders, calls stores auth failure as expected", async (done) => {
      await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));
      const storeDispatch = mockStoreDispatch.mock.calls[0][0].dispatch;

      expect(mockHandleExpiredAuth).toBeCalledTimes(0);
      act(() => storeDispatch({ type: ApiActions.FailureAuth }));
      await expect(mockHandleExpiredAuth).toBeCalledTimes(1);

      done();
    });

    it("renders ItemDetails with correct props", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(3));
      const call = ItemDetails.mock.calls[1][0];
      propCount(call, 9);
      expect(call.item).toBe(mockItem);
      expect(call.headerTitle).toBe(props.headerTitle);
      expect(call.title).toBe(props.title);
      expect(call.helpText).toBe(props.helpText);
      expect(call.transaction).toBe(false);
      expect(call.stores).toStrictEqual([mockStore]);
      expect(call.shelves).toStrictEqual([mockShelf]);
      expect(call.handleSave).toBeInstanceOf(Function);
      expect(call.handleDelete).toBeInstanceOf(Function);
      done();
    });

    it("handles a call to handleSave as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(3));

      const mockObject = { id: 99 };

      const handleSave = ItemDetails.mock.calls[1][0].handleSave;
      expect(handleSave).toBeInstanceOf(Function);
      act(() => handleSave(mockObject));

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      const updateDispatch = mockItemDispatch.mock.calls[1][0];
      propCount(updateDispatch, 4);

      expect(updateDispatch.type).toBe(ApiActions.StartUpdate);
      expect(updateDispatch.func).toBe(ApiFunctions.asyncUpdate);
      expect(updateDispatch.dispatch.name).toBe("bound dispatchAction");
      expect(updateDispatch.payload).toStrictEqual({ id: mockObject.id });

      done();
    });

    it("handles a call to handleDelete as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(3));

      // Perform Initial Get and Lists on API Data
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));

      const mockObject = { id: 7 };

      const handleDelete = ItemDetails.mock.calls[1][0].handleDelete;
      expect(handleDelete).toBeInstanceOf(Function);

      act(() => handleDelete(mockObject));

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      const deleteDispatch = mockItemDispatch.mock.calls[1][0];
      propCount(deleteDispatch, 4);

      expect(deleteDispatch.type).toBe(ApiActions.StartDel);
      expect(deleteDispatch.func).toBe(ApiFunctions.asyncDel);
      expect(deleteDispatch.dispatch.name).toBe("bound dispatchAction");
      expect(deleteDispatch.payload).toStrictEqual({ id: mockObject.id });

      done();
    });

    it("handles successful delete as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(3));

      // Perform Initial Get and Lists on API Data
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));

      const mockObject = { id: 7 };

      // Get Perform Async By Using The Delete Handler

      const handleDelete = ItemDetails.mock.calls[1][0].handleDelete;
      expect(handleDelete).toBeInstanceOf(Function);

      act(() => handleDelete(mockObject));

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      const deleteDispatch = mockItemDispatch.mock.calls[1][0].dispatch;

      expect(mockGoBack).toBeCalledTimes(0);
      deleteDispatch({ type: ApiActions.SuccessDel });

      // The successful delete should trigger the back button
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(3));
      expect(mockGoBack).toBeCalledTimes(1);

      done();
    });
  });

  describe("when item does not exists", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      current.id = "2";
      utils = render(
        <MemoryRouter>
          <StoreContext.Provider
            value={{ ...mockStoreProvider, transaction: false }}
          >
            <ShelfContext.Provider
              value={{ ...mockShelfProvider, transaction: false }}
            >
              <ItemContext.Provider
                value={{
                  ...mockItemsProvider,
                  transaction: false,
                }}
              >
                <ItemDetailsContainer {...current} />
              </ItemContext.Provider>
            </ShelfContext.Provider>
          </StoreContext.Provider>
        </MemoryRouter>
      );
    });
    it("throws an error", async (done) => {
      // Not Implemented Yet
      expect(true).toBe(false);
      done();
    });
  });
});
