import React from "react";
import {
  render,
  cleanup,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { ItemContext } from "../../../providers/api/item/item.provider";
import { TransactionContext } from "../../../providers/api/transaction/transaction.provider";

import ErrorHandler from "../../error-handler/error-handler.component";
import ItemList from "../item-list.component";
import ItemListRow from "../../item-list-row/item-list-row.component";
import Header from "../../header/header.component";
import Help from "../../simple-list-help/simple-list-help.component";
import Alert from "../../alert/alert.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";

import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import calculateMaxHeight from "../../../util/height";

jest.mock("../../holding-pattern/holding-pattern.component");
jest.mock("../../item-list-row/item-list-row.component");
jest.mock("../../header/header.component");
jest.mock("../../simple-list-help/simple-list-help.component");
jest.mock("../../alert/alert.component");
jest.mock("../../error-handler/error-handler.component");
jest.mock("../../../util/height");

ErrorHandler.mockImplementation(({ children }) => children);
ItemListRow.mockImplementation(() => <div>MockListItem</div>);
Header.mockImplementation(() => <div>MockHeader</div>);
Help.mockImplementation(() => <div>MockHelp</div>);
Alert.mockImplementation(() => <div>MockAlert</div>);
HoldingPattern.mockImplementation(({ children }) => children);
calculateMaxHeight.mockImplementation(() => 200);

const mockItemDispatch = jest.fn();
const mockTransactionDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();

const mockItems = [
  {
    expired: 0,
    id: 1,
    name: "Vegan Cheese",
    next_expiry_date: "2020-06-15",
    next_expiry_quantity: 0,
    preferred_stores: [1],
    price: "4.00",
    quantity: 2,
    shelf: 2,
    shelf_life: 25,
  },
  {
    expired: 2,
    id: 2,
    name: "Veggie Burgers",
    next_expiry_date: "2020-06-15",
    next_expiry_quantity: 0,
    preferred_stores: [1],
    price: "6.00",
    quantity: 4,
    shelf: 2,
    shelf_life: 25,
  },
  {
    expired: 2,
    id: 3,
    name: "Veggie Broth",
    next_expiry_date: "2020-06-15",
    next_expiry_quantity: 0,
    preferred_stores: [1],
    price: "2.00",
    quantity: 1,
    shelf: 2,
    shelf_life: 25,
  },
];

const mockDataState = {
  transaction: false,
  error: false,
  errorMsg: null,
};

const mockPlaceHolderMessage = "I'm Right Here";

describe("Setup Environment", () => {
  let current;
  let utils;
  let mockTitle = "mockTitle";
  let mockHeaderTitle = "mockHeaderTitle";

  beforeEach(() => {
    jest.clearAllMocks();
    current = {
      ...mockDataState,
      inventory: [...mockItems],
    };
  });

  afterEach(cleanup);

  const renderHelper = (
    itemContextValue,
    transactionContextValue,
    history,
    override = null
  ) => {
    return render(
      <ItemContext.Provider value={itemContextValue}>
        <TransactionContext.Provider value={transactionContextValue}>
          <Router history={history}>
            {override === null ? (
              <ItemList
                title={mockTitle}
                headerTitle={mockHeaderTitle}
                ApiObjectContext={ItemContext}
                placeHolderMessage={mockPlaceHolderMessage}
                handleExpiredAuth={mockHandleExpiredAuth}
                helpText={Strings.Testing.GenericTranslationTestString}
              />
            ) : (
              <ItemList
                title={mockTitle}
                headerTitle={mockHeaderTitle}
                ApiObjectContext={ItemContext}
                placeHolderMessage={mockPlaceHolderMessage}
                handleExpiredAuth={mockHandleExpiredAuth}
                helpText={Strings.Testing.GenericTranslationTestString}
                waitForApi={override}
              />
            )}
          </Router>
        </TransactionContext.Provider>
      </ItemContext.Provider>
    );
  };

  const validateFunctions = (call) => {
    expect(call.listFunctions.setActionMsg).toBeInstanceOf(Function);
    expect(call.listFunctions.setErrorMsg).toBeInstanceOf(Function);
    expect(call.listFunctions.restock).toBeInstanceOf(Function);
    expect(call.listFunctions.consume).toBeInstanceOf(Function);

    expect(call.listFunctions.setActionMsg.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setErrorMsg.name).toBe("bound dispatchAction");
    expect(call.listFunctions.restock.name).toBe("handleReStock");
    expect(call.listFunctions.consume.name).toBe("handleConsume");
  };

  describe("outside of an error", () => {
    beforeEach(() => {
      current.error = false;
    });
    describe("outside of a transaction", () => {
      beforeEach(() => {
        current.transaction = false;
      });

      describe("with items in the inventory", () => {
        beforeEach(() => {
          current.inventory = [...mockItems];
          let history = createBrowserHistory();
          history.push(Routes.items);

          const itemContext = {
            apiObject: { ...current },
            dispatch: mockItemDispatch,
          };
          const transactionContext = {
            apiObject: { ...current },
            dispatch: mockTransactionDispatch,
          };

          utils = renderHelper(itemContext, transactionContext, history, false);
        });

        it("renders, outside of a transaction should call ErrorHandler with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(ErrorHandler).toHaveBeenCalledTimes(1);

          const errorHandlerCall = ErrorHandler.mock.calls[0][0];
          propCount(errorHandlerCall, 7);
          expect(errorHandlerCall.condition).toBe(false);
          expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
          expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
          expect(errorHandlerCall.stringsRoot).toBe(Strings.ItemList);
          expect(errorHandlerCall.redirect).toBe(Routes.goBack);
          expect(errorHandlerCall.children).toBeTruthy();
        });

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

        it("renders, outside of a transaction should call HoldingPattern with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(HoldingPattern).toHaveBeenCalledTimes(1);

          const holdingPatternCall = HoldingPattern.mock.calls[0][0];
          propCount(holdingPatternCall, 2);
          expect(holdingPatternCall.condition).toBe(false);
        });

        it("renders, outside of a transaction should call help with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(Help).toHaveBeenCalledTimes(1);

          const helpCall = Help.mock.calls[0][0];
          propCount(helpCall, 1);
          expect(helpCall.children).toBe(
            Strings.Testing.GenericTranslationTestString
          );
        });

        it("renders, outside of a transaction should call the ItemListRow component(s) with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(ItemListRow).toHaveBeenCalledTimes(3);

          const call1 = ItemListRow.mock.calls[0][0];
          propCount(call1, 5);
          propCount(call1.listFunctions, 4);
          propCount(call1.listValues, 1);

          expect(call1.item).toBe(mockItems[0]);
          expect(call1.allItems).toStrictEqual(mockItems);
          expect(call1.listValues.transaction).toBe(false);
          expect(call1.history.push).toBeInstanceOf(Function);

          validateFunctions(call1);

          const call2 = ItemListRow.mock.calls[1][0];
          propCount(call1, 5);
          propCount(call1.listFunctions, 4);
          propCount(call1.listValues, 1);

          expect(call2.item).toBe(mockItems[1]);
          expect(call2.allItems).toStrictEqual(mockItems);
          expect(call2.listValues.transaction).toBe(false);
          expect(call1.history.push).toBeInstanceOf(Function);

          validateFunctions(call2);

          const call3 = ItemListRow.mock.calls[2][0];
          propCount(call1, 5);
          propCount(call1.listFunctions, 4);
          propCount(call1.listValues, 1);

          expect(call3.item).toBe(mockItems[2]);
          expect(call3.allItems).toStrictEqual(mockItems);
          expect(call3.listValues.transaction).toBe(false);
          expect(call1.history.push).toBeInstanceOf(Function);

          validateFunctions(call3);
        });

        it("renders, there should be no error messages set", () => {
          expect(ItemListRow).toHaveBeenCalledTimes(3);
          expect(utils.getByText(mockTitle)).toBeTruthy();
        });

        it("renders, when an error occurs it's rendered", async (done) => {
          expect(ItemListRow).toHaveBeenCalledTimes(3);

          const { setErrorMsg } = ItemListRow.mock.calls[0][0].listFunctions;
          ItemListRow.mockClear(); // Prepare for rerender, so we can count again

          act(() => {
            setErrorMsg("Error");
          });
          await waitFor(() =>
            expect(utils.queryByText(mockTitle)).not.toBeInTheDocument()
          );
          expect(utils.getByText("Error")).toBeTruthy();

          done();
        });

        it("renders, calls StartList on first render", async (done) => {
          expect(current.transaction).toBeFalsy();
          await waitFor(() =>
            expect(mockItemDispatch).toHaveBeenCalledTimes(1)
          );
          const apiCall = mockItemDispatch.mock.calls[0][0];
          propCount(apiCall, 5);
          expect(apiCall.type).toBe(ApiActions.StartList);
          expect(apiCall.func).toBe(ApiFunctions.asyncList);
          expect(apiCall.dispatch).toBeInstanceOf(Function);
          expect(apiCall.callback).toBeInstanceOf(Function);
          expect(apiCall.filter).toBeInstanceOf(URLSearchParams);
          done();
        });

        it("renders, handles a create event", async (done) => {
          expect(Header).toHaveBeenCalledTimes(1);
          const { create } = Header.mock.calls[0][0];
          expect(current.transaction).toBeFalsy();

          ItemListRow.mockClear();
          act(() => {
            create();
          });

          await waitFor(() =>
            expect(window.location.pathname).toBe(Routes.create)
          );

          done();
        });

        it("renders, and dispatches the API reducer when handleReStock is called", async (done) => {
          expect(ItemListRow).toHaveBeenCalledTimes(3);
          const { restock } = ItemListRow.mock.calls[0][0].listFunctions;
          expect(current.transaction).toBeFalsy();

          act(() => {
            restock(mockItems[0], 22);
          });

          await waitFor(() =>
            expect(mockItemDispatch).toHaveBeenCalledTimes(2)
          );
          expect(mockItemDispatch.mock.calls[0][0].type).toBe(
            ApiActions.StartList
          ); // Initial List

          const apiCall = mockItemDispatch.mock.calls[1][0];
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartUpdate);
          expect(apiCall.func).toBe(ApiFunctions.asyncUpdate);
          expect(apiCall.payload).toStrictEqual({
            ...mockItems[0],
            quantity: parseInt(mockItems[0].quantity + 22),
          });
          expect(apiCall.dispatch).toBeInstanceOf(Function);
          done();
        });

        it("renders, and dispatches the API reducer when handleDelete is called", async (done) => {
          expect(ItemListRow).toHaveBeenCalledTimes(3);
          const { consume } = ItemListRow.mock.calls[0][0].listFunctions;
          expect(current.transaction).toBeFalsy();

          act(() => {
            consume(mockItems[0], 1);
          });

          await waitFor(() =>
            expect(mockItemDispatch).toHaveBeenCalledTimes(2)
          );
          expect(mockItemDispatch.mock.calls[0][0].type).toBe(
            ApiActions.StartList
          );

          const apiCall = mockItemDispatch.mock.calls[1][0];
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartUpdate);
          expect(apiCall.func).toBe(ApiFunctions.asyncUpdate);
          expect(apiCall.payload).toStrictEqual({
            ...mockItems[0],
            quantity: parseInt(mockItems[0].quantity) - 1,
          });
          expect(apiCall.dispatch).toBeInstanceOf(Function);
          done();
        });

        it("renders, and handles an auth failure condition as expected", async (done) => {
          expect(ItemListRow).toHaveBeenCalledTimes(3);
          const { consume } = ItemListRow.mock.calls[0][0].listFunctions;
          expect(current.transaction).toBeFalsy();

          act(() => {
            consume(mockItems[0], 1);
          });

          await waitFor(() =>
            expect(mockItemDispatch).toHaveBeenCalledTimes(2)
          );
          expect(mockItemDispatch.mock.calls[0][0].type).toBe(
            ApiActions.StartList
          );

          const apiCall = mockItemDispatch.mock.calls[1][0];
          const setPerformAsync = apiCall.dispatch;

          act(() => {
            setPerformAsync({ type: ApiActions.FailureAuth });
          });

          await waitFor(() =>
            expect(mockHandleExpiredAuth).toHaveBeenCalledTimes(1)
          );

          done();
        });

        it("should call calculateMaxHeight on render", () => {
          expect(calculateMaxHeight).toBeCalledTimes(1);
        });

        it("a should call calculateMaxHeight again on a window resize", async (done) => {
          expect(calculateMaxHeight).toBeCalledTimes(1);
          fireEvent(window, new Event("resize"));
          await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
          done();
        });
      });

      describe("with no items in the inventory", () => {
        beforeEach(() => {
          current.inventory = [];
          let history = createBrowserHistory();
          history.push(Routes.items);

          const itemContext = {
            apiObject: { ...current },
            dispatch: mockItemDispatch,
          };
          const transactionContext = {
            apiObject: { ...current },
            dispatch: mockTransactionDispatch,
          };

          utils = renderHelper(itemContext, transactionContext, history);
        });
        it("renders, outside of a transaction, with no items in the list, and renders the mockPlaceHolderMessage", () => {
          expect(current.transaction).toBe(false);

          expect(Header).toHaveBeenCalledTimes(1);
          expect(ItemListRow).toBeCalledTimes(0);
          expect(utils.getByText(mockPlaceHolderMessage)).toBeTruthy();
        });

        it("should call calculateMaxHeight on render", () => {
          expect(calculateMaxHeight).toBeCalledTimes(1);
        });

        it("a should call calculateMaxHeight again on a window resize", async (done) => {
          expect(calculateMaxHeight).toBeCalledTimes(1);
          fireEvent(window, new Event("resize"));
          await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
          done();
        });
      });
    });
    describe("inside of a transaction", () => {
      beforeEach(() => {
        current.transaction = true;
        current.waitForApi = false;
        let history = createBrowserHistory();
        history.push(Routes.items);

        const itemContext = {
          apiObject: { ...current },
          dispatch: mockItemDispatch,
        };
        const transactionContext = {
          apiObject: { ...current },
          dispatch: mockTransactionDispatch,
        };

        utils = renderHelper(itemContext, transactionContext, history, false);
      });

      it("renders, should call HoldingPattern with the correct params", () => {
        expect(current.transaction).toBe(true);

        expect(HoldingPattern).toHaveBeenCalledTimes(1);

        const holdingPatternCall = HoldingPattern.mock.calls[0][0];
        propCount(holdingPatternCall, 2);
        expect(holdingPatternCall.condition).toBe(false);
      });

      it("renders, and then when there is an transaction bypasses calls to handleCreate", async (done) => {
        expect(Header).toHaveBeenCalledTimes(1);
        const { create } = Header.mock.calls[0][0];
        expect(current.transaction).toBeTruthy();

        ItemListRow.mockClear(); // no changes, no rerender
        act(() => {
          create();
        });

        await waitFor(() =>
          expect(window.location.pathname).toBe(Routes.items)
        );

        done();
      });

      it("renders, and then when there is an transaction bypasses calls to handleConsume", async (done) => {
        expect(ItemListRow).toHaveBeenCalledTimes(3);
        const { consume } = ItemListRow.mock.calls[0][0].listFunctions;
        expect(current.transaction).toBeTruthy();

        ItemListRow.mockClear(); // no changes, no rerender
        act(() => {
          consume(mockItems[0], 1);
        });

        expect(ItemListRow).toHaveBeenCalledTimes(0);
        expect(mockItemDispatch).toHaveBeenCalledTimes(1);
        expect(mockItemDispatch.mock.calls[0][0].type).toBe(
          ApiActions.StartList
        );

        done();
      });

      it("renders, and then when there is an transaction bypasses calls to handleRestock", async (done) => {
        expect(ItemListRow).toHaveBeenCalledTimes(3);
        const { restock } = ItemListRow.mock.calls[0][0].listFunctions;
        expect(current.transaction).toBeTruthy();

        ItemListRow.mockClear(); // no changes, no rerender
        act(() => {
          restock(mockItems[0], 22);
        });

        expect(ItemListRow).toHaveBeenCalledTimes(0);
        // MockDispatch only has a call for the initial item listing, not for the add
        expect(mockItemDispatch).toHaveBeenCalledTimes(1);
        expect(mockItemDispatch.mock.calls[0][0].type).toBe(
          ApiActions.StartList
        );
        done();
      });

      it("should call calculateMaxHeight on render", () => {
        expect(calculateMaxHeight).toBeCalledTimes(1);
      });

      it("a should call calculateMaxHeight again on a window resize", async (done) => {
        expect(calculateMaxHeight).toBeCalledTimes(1);
        fireEvent(window, new Event("resize"));
        await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
        done();
      });
    });
  });

  describe("during an error", () => {
    beforeEach(() => {
      current.error = true;
      let history = createBrowserHistory();
      history.push(Routes.items);
      const itemContext = {
        apiObject: { ...current },
        dispatch: mockItemDispatch,
      };
      const transactionContext = {
        apiObject: { ...current },
        dispatch: mockTransactionDispatch,
      };

      utils = renderHelper(itemContext, transactionContext, history);
    });

    it("renders, outside of a transaction should call ErrorHandler with the correct params", () => {
      expect(current.transaction).toBe(false);

      expect(ErrorHandler).toHaveBeenCalledTimes(1);

      const errorHandlerCall = ErrorHandler.mock.calls[0][0];
      propCount(errorHandlerCall, 7);
      expect(errorHandlerCall.condition).toBe(true);
      expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
      expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
      expect(errorHandlerCall.stringsRoot).toBe(Strings.ItemList);
      expect(errorHandlerCall.redirect).toBe(Routes.goBack);
      expect(errorHandlerCall.children).toBeTruthy();
    });

    it("renders, clear error works as expected", async (done) => {
      expect(current.transaction).toBe(false);

      expect(ErrorHandler).toHaveBeenCalledTimes(1);
      const clearError = ErrorHandler.mock.calls[0][0].clearError;
      jest.clearAllMocks();

      act(() => clearError());
      await waitFor(() => expect(mockItemDispatch).toBeCalledTimes(1));
      expect(mockItemDispatch).toBeCalledWith({ type: ApiActions.ClearErrors });

      done();
    });

    it("should call calculateMaxHeight on render", () => {
      expect(calculateMaxHeight).toBeCalledTimes(1);
    });

    it("should call calculateMaxHeight again on a window resize", async (done) => {
      expect(calculateMaxHeight).toBeCalledTimes(1);
      fireEvent(window, new Event("resize"));
      await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
      done();
    });
  });
});
