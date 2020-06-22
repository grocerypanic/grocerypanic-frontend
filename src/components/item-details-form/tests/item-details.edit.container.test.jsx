import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import { MemoryRouter, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import ErrorHandler from "../../error-handler/error-handler.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import ItemDetails from "../item-details.component";
import ItemDetailsEditContainer from "../item-details.edit.container";

import { ItemContext } from "../../../providers/api/item/item.provider";
import { TransactionContext } from "../../../providers/api/transaction/transaction.provider";
import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../../providers/api/store/store.provider";

import ItemInitialValue from "../../../providers/api/item/item.initial";
import ShelfInitialValue from "../../../providers/api/shelf/shelf.initial";
import StoreInitialValue from "../../../providers/api/store/store.initial";
import TransactionInitialValue from "../../../providers/api/transaction/transaction.initial";

import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import Strings from "../../../configuration/strings";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import Routes from "../../../configuration/routes";

jest.mock("../item-details.component");
jest.mock("../../holding-pattern/holding-pattern.component");
jest.mock("../../error-handler/error-handler.component");

ErrorHandler.mockImplementation(({ children }) => children);
ItemDetails.mockImplementation(() => <div>MockDetails</div>);
HoldingPattern.mockImplementation(({ children }) => children);

const mockItemDispatch = jest.fn();
const mockStoreDispatch = jest.fn();
const mockShelfDispatch = jest.fn();
const mockTransactionDispatch = jest.fn();
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

const mockItemProvider = {
  dispatch: mockItemDispatch,
  apiObject: { ...ItemInitialValue, inventory: [mockItem] },
};

const mockStoreProvider = {
  dispatch: mockStoreDispatch,
  apiObject: { ...StoreInitialValue, inventory: [mockStore] },
};

const mockShelfProvider = {
  dispatch: mockShelfDispatch,
  apiObject: { ...ShelfInitialValue, inventory: [mockShelf] },
};

const mockTransactionProvider = {
  dispatch: mockTransactionDispatch,
  apiObject: { ...TransactionInitialValue, inventory: [] },
};

const props = {
  allItems: [mockItem],
  itemId: "1",
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  handleExpiredAuth: mockHandleExpiredAuth,
  helpText: Strings.Testing.GenericTranslationTestString,
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

  const renderHelper = (
    currentHistory,
    currentTransaction,
    currentProps,
    itemContext = { ...mockItemProvider },
    command = render
  ) => {
    itemContext.transaction = currentTransaction;
    return command(
      <Router history={currentHistory}>
        <StoreContext.Provider
          value={{ ...mockStoreProvider, transaction: currentTransaction }}
        >
          <ShelfContext.Provider
            value={{ ...mockShelfProvider, transaction: currentTransaction }}
          >
            <ItemContext.Provider value={{ ...itemContext }}>
              <TransactionContext.Provider
                value={{ ...mockTransactionProvider }}
              >
                <ItemDetailsEditContainer {...currentProps} />
              </TransactionContext.Provider>
            </ItemContext.Provider>
          </ShelfContext.Provider>
        </StoreContext.Provider>
      </Router>
    );
  };

  describe("when the item cannot be found", () => {
    let history;
    let itemProvider;
    beforeEach(() => {
      jest.clearAllMocks();
      history = createBrowserHistory();
      history.location.pathname = originalPath;
      itemProvider = { ...mockItemProvider };
      itemProvider.apiObject = { ...mockItemProvider.apiObject };
      itemProvider.apiObject.inventory = {
        ...mockItemProvider.apiObject.inventory,
      };
    });

    it("renders, attempts to load item that does not exist, throws error", async (done) => {
      itemProvider.apiObject.inventory = [mockItem];
      current.itemId = "2";
      current.testHook = true;
      utils = renderHelper(history, false, current, itemProvider);

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      expect(mockItemDispatch.mock.calls[0][0].type).toBe(
        ApiActions.FailureGet
      );
      expect(mockItemDispatch.mock.calls[1][0].type).toBe(ApiActions.StartList);

      done();
    });

    it("renders, attempts to load item that does not exist, with no inputs, throws error", async (done) => {
      itemProvider.apiObject.inventory = [];
      current.itemId = "2";
      current.testHook = true;
      utils = renderHelper(history, false, current, itemProvider);

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      expect(mockItemDispatch.mock.calls[0][0].type).toBe(
        ApiActions.FailureGet
      );
      expect(mockItemDispatch.mock.calls[1][0].type).toBe(ApiActions.StartList);

      done();
    });

    it("renders, attempts to load item that does not exist, fetch not performed yet", async (done) => {
      itemProvider.apiObject.inventory = [];
      current.itemId = "2";
      current.testHook = false;
      utils = renderHelper(history, false, current, itemProvider);

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      expect(mockItemDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);

      done();
    });

    it("renders, adds callback to SuccessList", async (done) => {
      itemProvider.apiObject.inventory = [];
      current.itemId = "2";
      current.testHook = false;
      utils = renderHelper(history, false, current, itemProvider);

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      const itemDispatch = mockItemDispatch.mock.calls[0][0].dispatch;
      act(() => itemDispatch({ type: ApiActions.SuccessList }));
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      expect(mockItemDispatch.mock.calls[1][0].callback.name).toBe(
        "bound dispatchAction"
      );
      done();
    });
  });

  describe("outside of an api error, outside of a transaction", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      const history = createBrowserHistory();
      history.location.pathname = originalPath;
      history.goBack = mockGoBack;

      utils = renderHelper(history, false, current);
    });

    it("renders, bypasses HoldingPattern as expected", async (done) => {
      await waitFor(() => expect(HoldingPattern).toHaveBeenCalledTimes(3));
      const call = HoldingPattern.mock.calls[0][0];
      propCount(call, 2);
      expect(call.condition).toBe(true);
      done();
    });

    it("renders, calls items.StartList on first render", async (done) => {
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      const call = mockItemDispatch.mock.calls[0][0];
      propCount(call, 3);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
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
      const call = ItemDetails.mock.calls[2][0];
      propCount(call, 12);
      expect(call.allItems).toStrictEqual(props.allItems);
      expect(call.item).toBe(mockItem);
      expect(call.headerTitle).toBe(props.headerTitle);
      expect(call.title).toBe(props.title);
      expect(call.helpText).toBe(props.helpText);
      expect(call.transaction).toBe(false);
      expect(call.tr).toStrictEqual([]);
      expect(call.stores).toStrictEqual([mockStore]);
      expect(call.shelves).toStrictEqual([mockShelf]);
      expect(call.handleSave).toBeInstanceOf(Function);
      expect(call.handleDelete).toBeInstanceOf(Function);
      expect(call.requestTransactions).toBeInstanceOf(Function);
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
      act(() => deleteDispatch({ type: ApiActions.SuccessDel }));

      // The successful delete should trigger the back button
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(3));
      expect(mockGoBack).toBeCalledTimes(1);

      done();
    });

    it("handles a call to handleTransactionRequest as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(3));

      const handleTr = ItemDetails.mock.calls[1][0].requestTransactions;
      expect(handleTr).toBeInstanceOf(Function);
      act(() => handleTr());

      await waitFor(() =>
        expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
      );
      const trCall = mockTransactionDispatch.mock.calls[0][0];
      propCount(trCall, 4);

      expect(trCall.type).toBe(ApiActions.StartList);
      expect(trCall.func).toBe(ApiFunctions.asyncList);
      expect(trCall.dispatch.name).toBe("bound dispatchAction");
      expect(trCall.payload).toStrictEqual({ id: mockItem.id });

      done();
    });

    it("renders, calls transaction auth failure as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(3));

      const handleTr = ItemDetails.mock.calls[1][0].requestTransactions;
      expect(handleTr).toBeInstanceOf(Function);
      act(() => handleTr());

      await waitFor(() =>
        expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
      );
      const trDispatch = mockTransactionDispatch.mock.calls[0][0].dispatch;

      await expect(mockHandleExpiredAuth).toBeCalledTimes(0);
      act(() => trDispatch({ type: ApiActions.FailureAuth }));
      await expect(mockHandleExpiredAuth).toBeCalledTimes(1);

      done();
    });
  });

  describe("during an error", () => {
    const renderHelper = (
      storeContext,
      shelfContext,
      itemContext,
      transactionContext,
      currentProps
    ) =>
      render(
        <MemoryRouter>
          <StoreContext.Provider
            value={{ ...storeContext, transaction: false }}
          >
            <ShelfContext.Provider
              value={{ ...shelfContext, transaction: false }}
            >
              <ItemContext.Provider
                value={{
                  ...itemContext,
                  transaction: false,
                }}
              >
                <TransactionContext.Provider
                  value={{ ...transactionContext, transaction: false }}
                >
                  <ItemDetailsEditContainer {...currentProps} />
                </TransactionContext.Provider>
              </ItemContext.Provider>
            </ShelfContext.Provider>
          </StoreContext.Provider>
        </MemoryRouter>
      );

    describe("during a store api error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current.id = "2";
        const TestContext = {
          ...mockStoreProvider,
          apiObject: { ...StoreInitialValue },
        };
        TestContext.apiObject.transaction = false;
        TestContext.apiObject.error = true;
        utils = renderHelper(
          TestContext,
          mockShelfProvider,
          mockItemProvider,
          mockTransactionProvider,
          current
        );
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 7);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.stringsRoot).toBe(Strings.ItemDetails);
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockStoreDispatch).toBeCalledTimes(1));
        expect(mockStoreDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });

        done();
      });
    });

    describe("during a shelf api error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current.id = "2";
        const TestContext = {
          ...mockShelfProvider,
          apiObject: { ...ShelfInitialValue },
        };
        TestContext.apiObject.transaction = false;
        TestContext.apiObject.error = true;
        utils = renderHelper(
          mockStoreProvider,
          TestContext,
          mockItemProvider,
          mockTransactionProvider,
          current
        );
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 7);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.stringsRoot).toBe(Strings.ItemDetails);
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockShelfDispatch).toBeCalledTimes(1));
        expect(mockShelfDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });

        done();
      });
    });

    describe("during a item api error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current.id = "2";
        const TestContext = {
          ...mockItemProvider,
          apiObject: { ...ItemInitialValue },
        };
        TestContext.apiObject.transaction = false;
        TestContext.apiObject.error = true;
        utils = renderHelper(
          mockStoreProvider,
          mockShelfProvider,
          TestContext,
          mockTransactionProvider,
          current
        );
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 7);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.stringsRoot).toBe(Strings.ItemDetails);
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockItemDispatch).toBeCalledTimes(1));
        expect(mockItemDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });

        done();
      });
    });

    describe("during a transaction api error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current.id = "2";
        const TestContext = {
          ...mockTransactionProvider,
          apiObject: { ...TransactionInitialValue },
        };
        TestContext.apiObject.transaction = false;
        TestContext.apiObject.error = true;
        utils = renderHelper(
          mockStoreProvider,
          mockShelfProvider,
          mockItemProvider,
          TestContext,
          current
        );
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 7);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.stringsRoot).toBe(Strings.ItemDetails);
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockTransactionDispatch).toBeCalledTimes(1));
        expect(mockTransactionDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });

        done();
      });
    });
  });
});
