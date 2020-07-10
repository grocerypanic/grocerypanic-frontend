import React from "react";
import { render, act, waitFor, fireEvent } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import i18next from "i18next";

import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { ItemContext } from "../../../providers/api/item/item.provider";
import { TransactionContext } from "../../../providers/api/transaction/transaction.provider";
import { Constants } from "../../../configuration/backend";

import ErrorHandler from "../../error-handler/error-handler.component";
import Pagination from "../../pagination/pagination.component";
import ItemList from "../item-list.component";
import ItemListRow from "../../item-list-row/item-list-row.component";
import Hint from "../../hint/hint.component";
import Alert from "../../alert/alert.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";

import { HeaderContext } from "../../../providers/header/header.provider";
import initialHeaderSettings from "../../../providers/header/header.initial";

import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import calculateMaxHeight from "../../../util/height";

jest.mock("../../holding-pattern/holding-pattern.component");
jest.mock("../../item-list-row/item-list-row.component");
jest.mock("../../hint/hint.component");
jest.mock("../../alert/alert.component");
jest.mock("../../error-handler/error-handler.component");
jest.mock("../../../util/height");
jest.mock("../../pagination/pagination.component");

ErrorHandler.mockImplementation(({ children }) => children);
ItemListRow.mockImplementation(() => <div>MockListItem</div>);
Hint.mockImplementation(() => <div>MockHelp</div>);
Alert.mockImplementation(() => <div>MockAlert</div>);
Pagination.mockImplementation(() => <div>MockPagination</div>);
HoldingPattern.mockImplementation(({ children }) => children);
calculateMaxHeight.mockImplementation(() => 200);

const mockHeaderUpdate = jest.fn();
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
  fail: false,
  errorMsg: null,
};

const mockPlaceHolderMessage = "I'm Right Here";

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

describe("Setup Environment", () => {
  let current;
  let utils;
  let mockTitle = "mockTitle";
  let mockHeaderTitle = "mockHeaderTitle";
  let history;
  const originalWindow = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    current = {
      ...mockDataState,
      inventory: [...mockItems],
    };
  });

  afterEach(() => {
    window.location = originalWindow;
  });

  const renderHelper = (
    itemContextValue,
    transactionContextValue,
    currentHistory,
    override = null,
    command = render
  ) => {
    return command(
      <AnalyticsContext.Provider value={mockAnalyticsContext}>
        <HeaderContext.Provider
          value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
        >
          <ItemContext.Provider value={itemContextValue}>
            <TransactionContext.Provider value={transactionContextValue}>
              <Router history={currentHistory}>
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
        </HeaderContext.Provider>
        s
      </AnalyticsContext.Provider>
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

  describe("outside of a failure", () => {
    beforeEach(() => {
      current.fail = false;
    });
    describe("outside of a transaction", () => {
      beforeEach(() => {
        current.transaction = false;
      });

      describe("with wait for api engaged", () => {
        beforeEach(() => {
          current.inventory = [...mockItems];
          history = createBrowserHistory();
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

        it("renders, should call HoldingPattern with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(HoldingPattern).toHaveBeenCalledTimes(1);

          const holdingPatternCall = HoldingPattern.mock.calls[0][0];
          propCount(holdingPatternCall, 2);
          expect(holdingPatternCall.condition).toBe(true);
        });

        it("renders, should call pagination with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(Pagination).toHaveBeenCalledTimes(1);
          const pagination = Pagination.mock.calls[0][0];
          propCount(pagination, 2);
          expect(pagination.apiObject).toStrictEqual(current);
          expect(pagination.handlePagination).toBeInstanceOf(Function);
        });

        it("renders, after a successful list fetch, it should call HoldingPattern with the correct params", async (done) => {
          expect(current.transaction).toBe(false);

          await waitFor(() =>
            expect(mockItemDispatch).toHaveBeenCalledTimes(1)
          );
          const itemDispatch = mockItemDispatch.mock.calls[0][0].dispatch;
          act(() => itemDispatch({ type: ApiActions.SuccessList }));

          await waitFor(() =>
            expect(mockItemDispatch).toHaveBeenCalledTimes(2)
          );
          await waitFor(() => expect(HoldingPattern).toHaveBeenCalledTimes(3));

          const holdingPatternCall = HoldingPattern.mock.calls[2][0];
          propCount(holdingPatternCall, 2);
          expect(holdingPatternCall.condition).toBe(false);

          done();
        });

        it("should match the snapshot on file (styles)", () => {
          expect(utils.container).toMatchSnapshot();
        });
      });

      describe("with wait for api not engaged", () => {
        describe("when called from an url containing a query string with a page reference", () => {
          let page = "2";
          beforeEach(() => {
            delete window.location;
            window.location = new URL("https://myserver.com:8080");
            window.location = new URL(
              "https://myserver.com:8080?" +
                Constants.pageLookupParam +
                "=" +
                page
            );
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

          it("renders, calls StartList on first render, with a page param", async (done) => {
            expect(current.transaction).toBeFalsy();
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );
            const apiCall = mockItemDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartList);
            expect(apiCall.func).toBe(ApiFunctions.asyncList);
            expect(apiCall.dispatch).toBeInstanceOf(Function);
            expect(apiCall.filter).toBeInstanceOf(URLSearchParams);
            expect(apiCall.page).toBe(page);
            done();
          });
        });

        describe("with called from an url containing some other query string", () => {
          let qstring;
          beforeEach(() => {
            current.inventory = [...mockItems];
            let history = createBrowserHistory();
            qstring = { "query string": "parameter&&!" };
            history.push(
              Routes.items + "?" + new URLSearchParams(qstring).toString()
            );

            const itemContext = {
              apiObject: { ...current },
              dispatch: mockItemDispatch,
            };
            const transactionContext = {
              apiObject: { ...current },
              dispatch: mockTransactionDispatch,
            };

            utils = renderHelper(
              itemContext,
              transactionContext,
              history,
              false
            );
          });

          it("renders, handles a create event with query params passed along", async (done) => {
            expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
            const { create } = mockHeaderUpdate.mock.calls[0][0];
            expect(current.transaction).toBeFalsy();

            ItemListRow.mockClear();
            act(() => {
              create();
            });

            await waitFor(() =>
              expect(window.location.pathname).toBe(Routes.create)
            );

            // The query string is passed along
            expect(window.location.search).toBe(
              "?" + new URLSearchParams(qstring).toString()
            );

            // The url has changed, so this should get called again
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(2)
            );

            done();
          });
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

            utils = renderHelper(
              itemContext,
              transactionContext,
              history,
              false
            );
          });

          it("renders, should call the error handler with the correct params", async (done) => {
            await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(1));
            const call = ErrorHandler.mock.calls[0][0];
            propCount(call, 6);
            expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
            expect(call.condition).toBe(false);
            expect(call.clearError).toBeInstanceOf(Function);
            expect(call.messageTranslationKey).toBe("ItemList.ApiError");
            expect(call.redirect).toBe(Routes.goBack);
            expect(call.children).toBeTruthy();

            expect(i18next.t("ItemList.ApiError")).toBe(
              Strings.ItemList.ApiError
            );

            done();
          });

          it("renders, should call header with the correct params", () => {
            expect(current.transaction).toBe(false);

            expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
            const headerCall = mockHeaderUpdate.mock.calls[0][0];
            expect(headerCall.title).toBe(mockHeaderTitle);
            expect(headerCall.create).toBeInstanceOf(Function);
            expect(headerCall.transaction).toBe(false);
            expect(headerCall.disableNav).toBe(false);
          });

          it("renders, should call pagination with the correct params", () => {
            expect(current.transaction).toBe(false);

            expect(Pagination).toHaveBeenCalledTimes(1);
            const pagination = Pagination.mock.calls[0][0];
            propCount(pagination, 2);
            expect(pagination.apiObject).toStrictEqual(current);
            expect(pagination.handlePagination).toBeInstanceOf(Function);
          });

          it("renders, should handle a call to handlePagination correctly", async (done) => {
            expect(current.transaction).toBe(false);
            expect(Pagination).toHaveBeenCalledTimes(1);
            const handlePagination =
              Pagination.mock.calls[0][0].handlePagination;

            act(() => handlePagination("http://next"));

            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(2)
            );

            const apiCall = mockItemDispatch.mock.calls[1][0];
            propCount(apiCall, 4);
            expect(apiCall.type).toBe(ApiActions.StartList);
            expect(apiCall.func).toBe(ApiFunctions.asyncList);
            expect(apiCall.dispatch).toBeInstanceOf(Function);
            expect(apiCall.override).toBe("http://next");
            done();
          });

          it("renders, outside of a transaction should call HoldingPattern with the correct params", () => {
            expect(current.transaction).toBe(false);

            expect(HoldingPattern).toHaveBeenCalledTimes(1);

            const holdingPatternCall = HoldingPattern.mock.calls[0][0];
            propCount(holdingPatternCall, 2);
            expect(holdingPatternCall.condition).toBe(false);
          });

          it("renders, outside of a transaction should call hint with the correct params", () => {
            expect(current.transaction).toBe(false);

            expect(Hint).toHaveBeenCalledTimes(1);

            const helpCall = Hint.mock.calls[0][0];
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
            expect(apiCall.filter).toBeInstanceOf(URLSearchParams);
            expect(apiCall.page).toBe(null);
            done();
          });

          it("renders, and handles an transaction auth failure condition as expected", async (done) => {
            expect(current.transaction).toBeFalsy();
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );
            const apiCall = mockItemDispatch.mock.calls[0][0];
            const setPerformAsync = apiCall.dispatch;

            act(() => {
              setPerformAsync({ type: ApiActions.FailureAuth });
            });

            await waitFor(() =>
              expect(mockHandleExpiredAuth).toBeCalledTimes(1)
            );

            done();
          });

          it("renders, handles a create event as expected", async (done) => {
            expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
            const { create } = mockHeaderUpdate.mock.calls[0][0];
            expect(current.transaction).toBeFalsy();

            ItemListRow.mockClear();
            act(() => {
              create();
            });

            await waitFor(() =>
              expect(window.location.pathname).toBe(Routes.create)
            );

            // no query params are passed along
            expect(window.location.search).toBe("");

            // The url has changed, so this should get called again
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(2)
            );

            done();
          });

          it("renders, whenever the route changes startlist is triggered again.", async (done) => {
            expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
            const { create } = mockHeaderUpdate.mock.calls[0][0];

            // Use the create function to change the url

            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );

            act(() => {
              create();
            });

            await waitFor(() =>
              expect(window.location.pathname).toBe(Routes.create)
            );

            // The url has changed, so this should get called again
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(2)
            );

            // The new call to the item dispatcher, is to update the items

            const apiCall = mockItemDispatch.mock.calls[1][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartList);
            expect(apiCall.func).toBe(ApiFunctions.asyncList);
            expect(apiCall.dispatch).toBeInstanceOf(Function);
            expect(apiCall.filter).toBeInstanceOf(URLSearchParams);
            expect(apiCall.page).toBe(null);

            done();
          });

          it("renders, and dispatches the API reducer when handleReStock is called", async (done) => {
            expect(ItemListRow).toHaveBeenCalledTimes(3);
            const { restock } = ItemListRow.mock.calls[0][0].listFunctions;
            expect(current.transaction).toBeFalsy();

            // Initial Item List
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );
            expect(mockItemDispatch.mock.calls[0][0].type).toBe(
              ApiActions.StartList
            );

            // Perform Inventory Change

            act(() => {
              restock(mockItems[0], 2);
            });

            await waitFor(() =>
              expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
            );

            const apiCall = mockTransactionDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartAdd);
            expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
            expect(apiCall.callback.name).toBe("callback");
            expect(apiCall.payload).toStrictEqual({
              item: mockItems[0].id,
              quantity: 2,
            });
            expect(apiCall.dispatch).toBeInstanceOf(Function);

            // Simulate Callback

            act(() =>
              apiCall.callback({
                success: true,
                complete: true,
              })
            );

            // ItemDispatch is Called Again to Refresh the Item

            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(2)
            );

            const itemCall = mockItemDispatch.mock.calls[1][0];
            propCount(itemCall, 4);
            expect(itemCall.type).toBe(ApiActions.StartGet);
            expect(itemCall.func).toBe(ApiFunctions.asyncGet);
            expect(itemCall.dispatch).toBeInstanceOf(Function);
            expect(itemCall.payload).toStrictEqual({ id: mockItems[0].id });

            // ensure event fires
            await waitFor(() =>
              expect(mockAnalyticsContext.event).toHaveBeenCalledWith(
                AnalyticsActions.TransactionRestock
              )
            );

            done();
          });

          it("renders, and dispatches the API reducer when handleConsume is called", async (done) => {
            expect(ItemListRow).toHaveBeenCalledTimes(3);
            const { consume } = ItemListRow.mock.calls[0][0].listFunctions;
            expect(current.transaction).toBeFalsy();

            // Initial Item List
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );
            expect(mockItemDispatch.mock.calls[0][0].type).toBe(
              ApiActions.StartList
            );

            // Perform Inventory Change

            act(() => {
              consume(mockItems[0], 1);
            });

            await waitFor(() =>
              expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
            );

            const apiCall = mockTransactionDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartAdd);
            expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
            expect(apiCall.callback.name).toBe("callback");
            expect(apiCall.payload).toStrictEqual({
              item: mockItems[0].id,
              quantity: -1,
            });
            expect(apiCall.dispatch).toBeInstanceOf(Function);

            // Simulate Callback

            act(() =>
              apiCall.callback({
                success: true,
                complete: true,
              })
            );

            // ItemDispatch is Called Again to Refresh the Item

            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(2)
            );

            const itemCall = mockItemDispatch.mock.calls[1][0];
            propCount(itemCall, 4);
            expect(itemCall.type).toBe(ApiActions.StartGet);
            expect(itemCall.func).toBe(ApiFunctions.asyncGet);
            expect(itemCall.dispatch).toBeInstanceOf(Function);
            expect(itemCall.payload).toStrictEqual({ id: mockItems[0].id });

            // ensure event fires
            await waitFor(() =>
              expect(mockAnalyticsContext.event).toHaveBeenCalledWith(
                AnalyticsActions.TransactionConsume
              )
            );

            done();
          });

          it("renders, and dispatches the API reducer when handleConsume is called, handles a failed transaction request as expected", async (done) => {
            expect(ItemListRow).toHaveBeenCalledTimes(3);
            const { consume } = ItemListRow.mock.calls[0][0].listFunctions;
            expect(current.transaction).toBeFalsy();

            // Initial Item List
            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );
            expect(mockItemDispatch.mock.calls[0][0].type).toBe(
              ApiActions.StartList
            );

            // Perform Inventory Change

            act(() => {
              consume(mockItems[0], 1);
            });

            await waitFor(() =>
              expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
            );

            const apiCall = mockTransactionDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartAdd);
            expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
            expect(apiCall.callback.name).toBe("callback");
            expect(apiCall.payload).toStrictEqual({
              item: mockItems[0].id,
              quantity: -1,
            });
            expect(apiCall.dispatch).toBeInstanceOf(Function);

            // Simulate Callback

            act(() =>
              apiCall.callback({
                success: false, // Transaction is reported as failed to post
                complete: false, // Transaction is reported as failed to post
              })
            );

            // ItemDispatch is NOT Called Again to Refresh the Item

            await waitFor(() =>
              expect(mockItemDispatch).toHaveBeenCalledTimes(1)
            );

            done();
          });

          it("renders, handles edge case where handleConsume is called on non-existent item", async (done) => {
            expect(ItemListRow).toHaveBeenCalledTimes(3);
            const { consume } = ItemListRow.mock.calls[0][0].listFunctions;
            expect(current.transaction).toBeFalsy();

            const nonExistentItem = {
              id: 99,
              name: "non-existent",
              quantity: 1,
            };

            act(() => {
              consume(nonExistentItem, 1);
            });

            await waitFor(() =>
              expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
            );

            const apiCall = mockTransactionDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartAdd);
            expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
            expect(apiCall.callback.name).toBe("callback");
            expect(apiCall.payload).toStrictEqual({
              item: nonExistentItem.id,
              quantity: -1,
            });
            expect(apiCall.dispatch).toBeInstanceOf(Function);

            // Ensure successful callback updates inventory
            act(() => apiCall.callback({ success: true, complete: true }));
            await (() => expect(ItemListRow).toHaveBeenCalledTimes(9));
            const call = ItemListRow.mock.calls[6][0];
            expect(call.item.quantity).toBe(mockItems[0].quantity);

            // Ensure unsucessful callback does not update inventory
            act(() => apiCall.callback({ success: false, complete: true }));
            await (() => expect(ItemListRow).toHaveBeenCalledTimes(9));
            const call2 = ItemListRow.mock.calls[6][0];
            expect(call2.item.quantity).toBe(mockItems[0].quantity);

            done();
          });

          it("renders, and handles an transaction auth failure condition as expected", async (done) => {
            expect(ItemListRow).toHaveBeenCalledTimes(3);
            const { restock } = ItemListRow.mock.calls[0][0].listFunctions;
            expect(current.transaction).toBeFalsy();

            act(() => {
              restock(mockItems[0], 1);
            });

            await waitFor(() =>
              expect(mockTransactionDispatch).toHaveBeenCalledTimes(1)
            );

            const apiCall = mockTransactionDispatch.mock.calls[0][0];
            const setPerformAsync = apiCall.dispatch;

            act(() => {
              setPerformAsync({ type: ApiActions.FailureAuth });
            });

            await waitFor(() =>
              expect(mockTransactionDispatch).toHaveBeenCalledTimes(2)
            );

            await waitFor(() =>
              expect(mockHandleExpiredAuth).toBeCalledTimes(1)
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

          it("should match the snapshot on file (styles)", () => {
            expect(utils.container).toMatchSnapshot();
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

            expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
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

          it("should match the snapshot on file (styles)", () => {
            expect(utils.container).toMatchSnapshot();
          });
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

      it("renders, should call header with the correct params", () => {
        expect(current.transaction).toBe(true);

        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        const headerCall = mockHeaderUpdate.mock.calls[0][0];
        expect(headerCall.title).toBe(mockHeaderTitle);
        expect(headerCall.create).toBeInstanceOf(Function);
        expect(headerCall.transaction).toBe(true);
        expect(headerCall.disableNav).toBe(false);
      });

      it("renders, should call pagination with the correct params", () => {
        expect(current.transaction).toBe(true);

        expect(Pagination).toHaveBeenCalledTimes(1);
        const pagination = Pagination.mock.calls[0][0];
        propCount(pagination, 2);
        expect(pagination.apiObject).toStrictEqual(current);
        expect(pagination.handlePagination).toBeInstanceOf(Function);
      });

      it("renders, should call HoldingPattern with the correct params", () => {
        expect(current.transaction).toBe(true);

        expect(HoldingPattern).toHaveBeenCalledTimes(1);

        const holdingPatternCall = HoldingPattern.mock.calls[0][0];
        propCount(holdingPatternCall, 2);
        expect(holdingPatternCall.condition).toBe(false);
      });

      it("renders, and then when there is an transaction bypasses calls to handleCreate", async (done) => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        const { create } = mockHeaderUpdate.mock.calls[0][0];
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

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });
  });

  describe("during an api failure", () => {
    beforeEach(() => {
      current.fail = true;
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

    it("renders, should call pagination with the correct params", () => {
      expect(current.transaction).toBe(false);

      expect(Pagination).toHaveBeenCalledTimes(1);
      const pagination = Pagination.mock.calls[0][0];
      propCount(pagination, 2);
      expect(pagination.apiObject).toStrictEqual(current);
      expect(pagination.handlePagination).toBeInstanceOf(Function);
    });

    it("renders, should call the error handler with the correct params", async (done) => {
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(1));
      const call = ErrorHandler.mock.calls[0][0];
      propCount(call, 6);
      expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
      expect(call.condition).toBe(true);
      expect(call.clearError).toBeInstanceOf(Function);
      expect(call.messageTranslationKey).toBe("ItemList.ApiError");
      expect(call.redirect).toBe(Routes.goBack);
      expect(call.children).toBeTruthy();

      expect(i18next.t("ItemList.ApiError")).toBe(Strings.ItemList.ApiError);

      done();
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

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container).toMatchSnapshot();
    });
  });
});
