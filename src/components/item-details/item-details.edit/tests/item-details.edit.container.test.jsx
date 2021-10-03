import { render, cleanup, waitFor, act } from "@testing-library/react";
import { createBrowserHistory } from "history";
import i18next from "i18next";
import React from "react";
import { MemoryRouter, Router } from "react-router-dom";
import Routes from "../../../../configuration/routes";
import Strings from "../../../../configuration/strings";
import { AnalyticsActions } from "../../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../../providers/analytics/analytics.provider";
import ActivityInitialValue from "../../../../providers/api/activity/activity.initial";
import { ActivityContext } from "../../../../providers/api/activity/activity.provider";
import ApiActions from "../../../../providers/api/api.actions";
import ApiFunctions from "../../../../providers/api/api.functions";
import ItemInitialValue from "../../../../providers/api/item/item.initial";
import { ItemContext } from "../../../../providers/api/item/item.provider";
import ShelfInitialValue from "../../../../providers/api/shelf/shelf.initial";
import { ShelfContext } from "../../../../providers/api/shelf/shelf.provider";
import StoreInitialValue from "../../../../providers/api/store/store.initial";
import { StoreContext } from "../../../../providers/api/store/store.provider";
import { propCount } from "../../../../test.fixtures/objectComparison";
import ErrorHandler from "../../../error-handler/error-handler.component";
import HoldingPattern from "../../../holding-pattern/holding-pattern.component";
import ItemDetailsEditContainer from "../item-details.edit.container";
import ItemDetailsTabs from "../item-details.edit.tabs.component.edit";

jest.mock("../item-details.edit.tabs.component.edit");
jest.mock("../../../holding-pattern/holding-pattern.component");
jest.mock("../../../error-handler/error-handler.component");

ErrorHandler.mockImplementation(({ children }) => children);
ItemDetailsTabs.mockImplementation(() => <div>MockDetails</div>);
HoldingPattern.mockImplementation(({ children }) => children);

const mockItemDispatch = jest.fn();
const mockStoreDispatch = jest.fn();
const mockShelfDispatch = jest.fn();
const mockActivityDispatch = jest.fn();
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

const mockActivityReport = {
  id: 1,
  activity_first: "2020-03-01",
  usage_total: 1,
  usage_avg_week: 0.17,
  usage_avg_month: 0.5,
  recent_activity: {
    user_timezone: "UTC",
    usage_current_week: 0,
    usage_current_month: 0,
    activity_last_two_weeks: [
      {
        date: "2020-06-18",
        change: 0,
      },
      {
        date: "2020-06-17",
        change: 0,
      },
      {
        date: "2020-06-16",
        change: 0,
      },
      {
        date: "2020-06-15",
        change: 0,
      },
      {
        date: "2020-06-14",
        change: 0,
      },
      {
        date: "2020-06-13",
        change: 0,
      },
      {
        date: "2020-06-12",
        change: 0,
      },
      {
        date: "2021-06-11",
        change: 0,
      },
      {
        date: "2021-06-10",
        change: 0,
      },
      {
        date: "2021-06-09",
        change: 0,
      },
      {
        date: "2020-06-08",
        change: 0,
      },
      {
        date: "2020-06-07",
        change: 0,
      },
      {
        date: "2020-06-06",
        change: 0,
      },
      {
        date: "2020-06-05",
        change: 0,
      },
    ],
  },
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

const mockActivityProvider = {
  dispatch: mockActivityDispatch,
  apiObject: { ...ActivityInitialValue, inventory: [] },
};

const props = {
  allItems: [mockItem],
  itemId: "1",
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  handleExpiredAuth: mockHandleExpiredAuth,
  helpText: Strings.Testing.GenericTranslationTestString,
};

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

describe("Setup Environment", () => {
  let current;
  let originalPath = "/some/unmatched/path";

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
    activityContext = { ...mockActivityProvider },
    command = render
  ) => {
    itemContext.transaction = currentTransaction;
    return command(
      <Router history={currentHistory}>
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <StoreContext.Provider
            value={{ ...mockStoreProvider, transaction: currentTransaction }}
          >
            <ShelfContext.Provider
              value={{ ...mockShelfProvider, transaction: currentTransaction }}
            >
              <ItemContext.Provider value={{ ...itemContext }}>
                <ActivityContext.Provider value={{ ...activityContext }}>
                  <ItemDetailsEditContainer {...currentProps} />
                </ActivityContext.Provider>
              </ItemContext.Provider>
            </ShelfContext.Provider>
          </StoreContext.Provider>
        </AnalyticsContext.Provider>
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

    it("renders, attempts to load item that does not exist, fetch not performed yet", async () => {
      itemProvider.apiObject.inventory = [];
      current.itemId = "2";
      current.testHook = false;
      renderHelper(history, false, current, itemProvider);

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      expect(mockItemDispatch.mock.calls[0][0].type).toBe(ApiActions.StartGet);
    });
  });

  describe("outside of an api error, outside of a transaction", () => {
    describe("with no activityReport fetched", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        const history = createBrowserHistory();
        history.location.pathname = originalPath;
        history.goBack = mockGoBack;

        renderHelper(history, false, current);
      });

      it("renders, bypasses HoldingPattern as expected", async () => {
        await waitFor(() => expect(HoldingPattern).toHaveBeenCalledTimes(3));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 2);
        expect(call.condition).toBe(true);
      });

      it("renders, calls items.StartGet on first render", async () => {
        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
        const call = mockItemDispatch.mock.calls[0][0];
        propCount(call, 4);
        expect(call.type).toBe(ApiActions.StartGet);
        expect(call.func).toBe(ApiFunctions.asyncGet);
        expect(call.dispatch).toBeInstanceOf(Function);
        expect(call.payload).toStrictEqual({ id: current.itemId });
      });

      it("renders, calls items auth failure as expected", async () => {
        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
        const itemDispatch = mockItemDispatch.mock.calls[0][0].dispatch;

        expect(mockHandleExpiredAuth).toBeCalledTimes(0);
        act(() => itemDispatch({ type: ApiActions.FailureAuth }));
        await expect(mockHandleExpiredAuth).toBeCalledTimes(1);
      });

      it("renders, calls shelves.StartList on first render", async () => {
        await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
        const call = mockShelfDispatch.mock.calls[0][0];
        propCount(call, 4);
        expect(call.type).toBe(ApiActions.StartList);
        expect(call.func).toBe(ApiFunctions.asyncList);
        expect(call.dispatch).toBeInstanceOf(Function);
        expect(call.fetchAll).toBe(1);
      });

      it("renders, calls shelves auth failure as expected", async () => {
        await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
        const shelfDispatch = mockShelfDispatch.mock.calls[0][0].dispatch;

        expect(mockHandleExpiredAuth).toBeCalledTimes(0);
        act(() => shelfDispatch({ type: ApiActions.FailureAuth }));
        await expect(mockHandleExpiredAuth).toBeCalledTimes(1);
      });

      it("renders, calls stores.StartList on first render", async () => {
        await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));
        const call = mockStoreDispatch.mock.calls[0][0];
        propCount(call, 4);
        expect(call.type).toBe(ApiActions.StartList);
        expect(call.func).toBe(ApiFunctions.asyncList);
        expect(call.dispatch).toBeInstanceOf(Function);
        expect(call.fetchAll).toBe(1);
      });

      it("renders, calls stores auth failure as expected", async () => {
        await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));
        const storeDispatch = mockStoreDispatch.mock.calls[0][0].dispatch;

        expect(mockHandleExpiredAuth).toBeCalledTimes(0);
        act(() => storeDispatch({ type: ApiActions.FailureAuth }));
        await expect(mockHandleExpiredAuth).toBeCalledTimes(1);
      });

      it("renders ItemDetails with correct props", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));
        const call = ItemDetailsTabs.mock.calls[2][0];
        propCount(call, 15);
        expect(call.allItems).toStrictEqual(props.allItems);
        expect(call.item).toBe(mockItem);
        expect(call.headerTitle).toBe(props.headerTitle);
        expect(call.title).toBe(props.title);
        expect(call.helpText).toBe(props.helpText);
        expect(call.transaction).toBe(false);
        expect(call.activity).toStrictEqual([]);
        expect(call.activityStatus).toBe(false);
        expect(call.stores).toStrictEqual([mockStore]);
        expect(call.shelves).toStrictEqual([mockShelf]);
        expect(call.handleSave).toBeInstanceOf(Function);
        expect(call.handleDelete).toBeInstanceOf(Function);
        expect(call.requestActivityReport).toBeInstanceOf(Function);
        expect(call.setDuplicate).toBeInstanceOf(Function);
        expect(call.duplicate).toBe(false);
      });

      it("handles a duplicate object error correctly", async () => {
        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
        const itemDispatch = mockItemDispatch.mock.calls[0][0].dispatch;

        act(() => itemDispatch({ type: ApiActions.DuplicateObject }));

        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));

        expect(ItemDetailsTabs).toHaveBeenCalledTimes(5);

        const call1 = ItemDetailsTabs.mock.calls[4][0];
        expect(call1.duplicate).toBe(true);
      });

      it("handles a call to handleSave as expected", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        const mockObject = { id: 99 };

        const handleSave = ItemDetailsTabs.mock.calls[1][0].handleSave;
        expect(handleSave).toBeInstanceOf(Function);
        act(() => handleSave(mockObject));

        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
        const updateDispatch = mockItemDispatch.mock.calls[1][0];
        propCount(updateDispatch, 4);

        expect(updateDispatch.type).toBe(ApiActions.StartUpdate);
        expect(updateDispatch.func).toBe(ApiFunctions.asyncUpdate);
        expect(updateDispatch.dispatch.name).toBe("bound dispatchAction");
        expect(updateDispatch.payload).toStrictEqual(mockObject);

        expect(mockAnalyticsContext.event).toBeCalledWith(
          AnalyticsActions.ItemModified
        );
      });

      it("handles a call to handleSave as expected, no changes to item", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        const mockObject = { ...mockItem };

        const handleSave = ItemDetailsTabs.mock.calls[1][0].handleSave;
        expect(handleSave).toBeInstanceOf(Function);
        act(() => handleSave(mockObject));

        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
        expect(mockAnalyticsContext.event).toBeCalledTimes(0);
      });

      it("handles a call to handleDelete as expected", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        // Perform Initial Get and Lists on API Data
        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));

        const mockObject = { id: 7 };

        const handleDelete = ItemDetailsTabs.mock.calls[1][0].handleDelete;
        expect(handleDelete).toBeInstanceOf(Function);

        act(() => handleDelete(mockObject));

        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
        const deleteDispatch = mockItemDispatch.mock.calls[1][0];
        propCount(deleteDispatch, 4);

        expect(deleteDispatch.type).toBe(ApiActions.StartDel);
        expect(deleteDispatch.func).toBe(ApiFunctions.asyncDel);
        expect(deleteDispatch.dispatch.name).toBe("bound dispatchAction");
        expect(deleteDispatch.payload).toStrictEqual({ id: mockObject.id });

        expect(mockAnalyticsContext.event).toBeCalledWith(
          AnalyticsActions.ItemDeleted
        );
      });

      it("handles successful delete as expected", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        // Perform Initial Get and Lists on API Data
        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));

        const mockObject = { id: 7 };

        // Get Perform Async By Using The Delete Handler

        const handleDelete = ItemDetailsTabs.mock.calls[1][0].handleDelete;
        expect(handleDelete).toBeInstanceOf(Function);

        act(() => handleDelete(mockObject));

        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
        const deleteDispatch = mockItemDispatch.mock.calls[1][0].dispatch;

        expect(mockGoBack).toBeCalledTimes(0);
        act(() => deleteDispatch({ type: ApiActions.SuccessDel }));

        // The successful delete should trigger the back button
        await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(3));
        expect(mockGoBack).toBeCalledTimes(1);
      });

      it("handles a call to requestActivityReport as expected", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        const handler = ItemDetailsTabs.mock.calls[1][0].requestActivityReport;
        expect(handler).toBeInstanceOf(Function);
        act(() => handler());

        await waitFor(() =>
          expect(mockActivityDispatch).toHaveBeenCalledTimes(1)
        );
        const call = mockActivityDispatch.mock.calls[0][0];
        propCount(call, 4);

        expect(call.type).toBe(ApiActions.StartGet);
        expect(call.func).toBe(ApiFunctions.asyncGet);
        expect(call.dispatch.name).toBe("bound dispatchAction");
        expect(call.payload).toStrictEqual({ id: mockItem.id });
      });

      it("handles a success call on activity get as expected", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        const handler = ItemDetailsTabs.mock.calls[1][0].requestActivityReport;
        expect(handler).toBeInstanceOf(Function);
        act(() => handler());

        await waitFor(() =>
          expect(mockActivityDispatch).toHaveBeenCalledTimes(1)
        );
        const call = mockActivityDispatch.mock.calls[0][0];

        act(() => call.dispatch({ type: ApiActions.SuccessGet }));
        await waitFor(() =>
          expect(mockActivityDispatch).toHaveBeenCalledTimes(2)
        );

        act(() => handler());

        await waitFor(() =>
          expect(mockActivityDispatch).toHaveBeenCalledTimes(3)
        );
      });

      it("renders, calls activity auth failure as expected", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        const handler = ItemDetailsTabs.mock.calls[1][0].requestActivityReport;
        expect(handler).toBeInstanceOf(Function);
        act(() => handler());

        await waitFor(() =>
          expect(mockActivityDispatch).toHaveBeenCalledTimes(1)
        );
        const dispatch = mockActivityDispatch.mock.calls[0][0].dispatch;

        await expect(mockHandleExpiredAuth).toBeCalledTimes(0);
        act(() => dispatch({ type: ApiActions.FailureAuth }));
        await expect(mockHandleExpiredAuth).toBeCalledTimes(1);
      });
    });

    describe("with activityReport fetched", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        const history = createBrowserHistory();
        history.location.pathname = originalPath;
        history.goBack = mockGoBack;
        const mockPopulatedActivityProvider = {
          dispatch: mockActivityDispatch,
          apiObject: {
            ...ActivityInitialValue,
            inventory: [{ ...mockActivityReport }],
          },
        };

        // enable testHook to block TR requests manually
        current.testHook = true;

        renderHelper(
          history,
          false,
          current,
          { ...mockItemProvider },
          mockPopulatedActivityProvider
        );
      });

      it("handles a call to requestActivityReport as expected, without refetching data", async () => {
        await waitFor(() => expect(ItemDetailsTabs).toHaveBeenCalledTimes(3));

        const handler = ItemDetailsTabs.mock.calls[1][0].requestActivityReport;
        expect(handler).toBeInstanceOf(Function);
        act(() => handler());

        // Should Not Request Transactions
        await waitFor(() =>
          expect(mockActivityDispatch).toHaveBeenCalledTimes(0)
        );
      });
    });
  });

  describe("during an error", () => {
    const renderHelper = (
      storeContext,
      shelfContext,
      itemContext,
      activityContext,
      currentProps
    ) =>
      render(
        <MemoryRouter>
          <AnalyticsContext.Provider value={mockAnalyticsContext}>
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
                  <ActivityContext.Provider
                    value={{ ...activityContext, transaction: false }}
                  >
                    <ItemDetailsEditContainer {...currentProps} />
                  </ActivityContext.Provider>
                </ItemContext.Provider>
              </ShelfContext.Provider>
            </StoreContext.Provider>
          </AnalyticsContext.Provider>
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
        TestContext.apiObject.fail = true;
        renderHelper(
          TestContext,
          mockShelfProvider,
          mockItemProvider,
          mockActivityProvider,
          current
        );
      });

      it("renders, should call the error handler with the correct params", async () => {
        await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(3));
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 6);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.condition).toBe(true);
        expect(call.clearError).toBeInstanceOf(Function);
        expect(call.messageTranslationKey).toBe("ItemDetails.ApiError");
        expect(call.redirect).toBe(Routes.goBack);
        expect(call.children).toBeTruthy();

        expect(i18next.t("ItemDetails.ApiError")).toBe(
          Strings.ItemDetails.ApiError
        );
      });

      it("renders, clear error works as expected", async () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockStoreDispatch).toBeCalledTimes(1));
        expect(mockStoreDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });
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
        TestContext.apiObject.fail = true;
        renderHelper(
          mockStoreProvider,
          TestContext,
          mockItemProvider,
          mockActivityProvider,
          current
        );
      });

      it("renders, should call the error handler with the correct params", async () => {
        await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(3));
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 6);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.condition).toBe(true);
        expect(call.clearError).toBeInstanceOf(Function);
        expect(call.messageTranslationKey).toBe("ItemDetails.ApiError");
        expect(call.redirect).toBe(Routes.goBack);
        expect(call.children).toBeTruthy();

        expect(i18next.t("ItemDetails.ApiError")).toBe(
          Strings.ItemDetails.ApiError
        );
      });

      it("renders, clear error works as expected", async () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockShelfDispatch).toBeCalledTimes(1));
        expect(mockShelfDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });
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
        TestContext.apiObject.fail = true;
        renderHelper(
          mockStoreProvider,
          mockShelfProvider,
          TestContext,
          mockActivityProvider,
          current
        );
      });

      it("renders, should call the error handler with the correct params", async () => {
        await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(3));
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 6);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.condition).toBe(true);
        expect(call.clearError).toBeInstanceOf(Function);
        expect(call.messageTranslationKey).toBe("ItemDetails.ApiError");
        expect(call.redirect).toBe(Routes.goBack);
        expect(call.children).toBeTruthy();

        expect(i18next.t("ItemDetails.ApiError")).toBe(
          Strings.ItemDetails.ApiError
        );
      });

      it("renders, clear error works as expected", async () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockItemDispatch).toBeCalledTimes(1));
        expect(mockItemDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });
      });
    });

    describe("during a activity api error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current.id = "2";
        const TestContext = {
          ...mockActivityProvider,
          apiObject: { ...ActivityInitialValue },
        };
        TestContext.apiObject.transaction = false;
        TestContext.apiObject.fail = true;
        renderHelper(
          mockStoreProvider,
          mockShelfProvider,
          mockItemProvider,
          TestContext,
          current
        );
      });

      it("renders, should call the error handler with the correct params", async () => {
        await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(3));
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 6);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.condition).toBe(true);
        expect(call.clearError).toBeInstanceOf(Function);
        expect(call.messageTranslationKey).toBe("ItemDetails.ApiError");
        expect(call.redirect).toBe(Routes.goBack);
        expect(call.children).toBeTruthy();

        expect(i18next.t("ItemDetails.ApiError")).toBe(
          Strings.ItemDetails.ApiError
        );
      });

      it("renders, clear error works as expected", async () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(3); // Three rerenders for API data
        const clearError = ErrorHandler.mock.calls[0][0].clearError;
        jest.clearAllMocks();

        act(() => clearError());
        await waitFor(() => expect(mockActivityDispatch).toBeCalledTimes(1));
        expect(mockActivityDispatch).toBeCalledWith({
          type: ApiActions.ClearErrors,
        });
      });
    });
  });
});
