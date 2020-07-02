import React from "react";
import { render, cleanup, waitFor, act } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";
import { MemoryRouter, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import i18Next from "i18next";

import ErrorHandler from "../../error-handler/error-handler.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import ItemDetailsForm from "../../item-details-form/item-details-form.component";
import ItemDetailsCreateContainer, {
  defaultItem,
} from "../item-details.create.container";

import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { ItemContext } from "../../../providers/api/item/item.provider";
import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../../providers/api/store/store.provider";
import { HeaderContext } from "../../../providers/header/header.provider";

import initialHeaderSettings from "../../../providers/header/header.initial";
import ItemInitialValue from "../../../providers/api/item/item.initial";
import ShelfInitialValue from "../../../providers/api/shelf/shelf.initial";
import StoreInitialValue from "../../../providers/api/store/store.initial";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import Strings from "../../../configuration/strings";
import Routes from "../../../configuration/routes";

jest.mock("../../item-details-form/item-details-form.component");
jest.mock("../../holding-pattern/holding-pattern.component");
jest.mock("../../error-handler/error-handler.component");

ErrorHandler.mockImplementation(({ children }) => children);
ItemDetailsForm.mockImplementation(() => <div>MockDetails</div>);
HoldingPattern.mockImplementation(({ children }) => children);

const mockHeaderUpdate = jest.fn();
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

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
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
  let current;
  let originalPath = "/some/unmatched/path";

  beforeEach(() => {
    current = { ...props };
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("outside of an error", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      const history = createBrowserHistory();
      history.location.pathname = originalPath;
      history.goBack = mockGoBack;

      render(
        <Router history={history}>
          <HeaderContext.Provider
            value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
          >
            <AnalyticsContext.Provider value={mockAnalyticsContext}>
              <StoreContext.Provider
                value={{ ...mockStoreProvider, transaction: false }}
              >
                <ShelfContext.Provider
                  value={{ ...mockShelfProvider, transaction: false }}
                >
                  <ItemContext.Provider
                    value={{
                      ...mockItemProvider,
                      transaction: false,
                    }}
                  >
                    <ItemDetailsCreateContainer {...current} />
                  </ItemContext.Provider>
                </ShelfContext.Provider>
              </StoreContext.Provider>
            </AnalyticsContext.Provider>
          </HeaderContext.Provider>
        </Router>
      );
    });

    it("renders, update the header with the correct params", () => {
      expect(mockHeaderUpdate).toHaveBeenCalledTimes(2);
      expect(mockHeaderUpdate).toHaveBeenLastCalledWith({
        title: current.headerTitle,
        create: null,
        transaction: false,
        disableNav: false,
      });
    });

    it("renders, bypasses ErrorHandler1 as expected", async (done) => {
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[2][0];
      propCount(call, 6);
      expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
      expect(call.condition).toBe(false);
      expect(call.clearError).toBeInstanceOf(Function);
      expect(call.messageTranslationKey).toBe(
        "ItemDetails.ApiCommunicationError"
      );
      expect(call.redirect).toBe(Routes.goBack);
      expect(call.children).toBeTruthy();

      expect(i18Next.t("ItemDetails.ApiCommunicationError")).toBe(
        Strings.ItemDetails.ApiCommunicationError
      );

      done();
    });

    it("renders, bypasses HoldingPattern as expected", async (done) => {
      await waitFor(() => expect(HoldingPattern).toHaveBeenCalledTimes(3));
      const call = HoldingPattern.mock.calls[0][0];
      propCount(call, 2);
      expect(call.condition).toBe(true);
      done();
    });

    it("renders, bypasses ErrorHandler2 as expected", async (done) => {
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[5][0];
      propCount(call, 6);
      expect(call.eventMessage).toBe(null);
      expect(call.condition).toBe(false);
      expect(call.clearError).toBeInstanceOf(Function);
      expect(call.messageTranslationKey).toBe(
        "ItemDetails.NeedShelvesAndStores"
      );
      expect(call.redirect).toBe(Routes.goBack);
      expect(call.children).toBeTruthy();

      expect(i18Next.t("ItemDetails.NeedShelvesAndStores")).toBe(
        Strings.ItemDetails.NeedShelvesAndStores
      );

      done();
    });

    it("renders, the ErrorHandler2 clearErrors function is a no op", async (done) => {
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[5][0];
      call.clearError();
      done();
    });

    it("renders, calls items.StartList on first render", async (done) => {
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      const call = mockItemDispatch.mock.calls[0][0];
      propCount(call, 4);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      expect(call.callback).toBeInstanceOf(Function);
      done();
    });

    it("renders, calls item auth failure as expected", async (done) => {
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
      propCount(call, 4);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      expect(call.callback).toBeInstanceOf(Function);
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
      propCount(call, 4);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      expect(call.callback).toBeInstanceOf(Function);
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
      await waitFor(() => expect(ItemDetailsForm).toHaveBeenCalledTimes(3));
      const call = ItemDetailsForm.mock.calls[1][0];
      propCount(call, 8);
      expect(call.allItems).toStrictEqual(props.allItems);
      expect(call.item).toStrictEqual({ ...defaultItem, shelf: 1 });
      expect(call.title).toBe(props.title);
      expect(call.helpText).toBe(props.helpText);
      expect(call.transaction).toBe(false);
      expect(call.stores).toStrictEqual([mockStore]);
      expect(call.shelves).toStrictEqual([mockShelf]);
      expect(call.handleSave).toBeInstanceOf(Function);
      done();
    });

    it("handles a call to handleSave as expected", async (done) => {
      await waitFor(() => expect(ItemDetailsForm).toHaveBeenCalledTimes(3));

      const mockObject = { id: 99, name: "New Item" };

      const handleSave = ItemDetailsForm.mock.calls[2][0].handleSave;
      expect(handleSave).toBeInstanceOf(Function);
      act(() => handleSave(mockObject));

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      const updateDispatch = mockItemDispatch.mock.calls[1][0];
      propCount(updateDispatch, 4);

      expect(updateDispatch.type).toBe(ApiActions.StartAdd);
      expect(updateDispatch.func).toBe(ApiFunctions.asyncAdd);
      expect(updateDispatch.dispatch.name).toBe("bound dispatchAction");
      expect(updateDispatch.payload).toStrictEqual(mockObject);

      expect(mockAnalyticsContext.event).toBeCalledWith(
        AnalyticsActions.ItemCreated
      );

      done();
    });

    it("handles a successful save as expected", async (done) => {
      await waitFor(() => expect(ItemDetailsForm).toHaveBeenCalledTimes(3));

      const mockObject = { id: 99 };

      const handleSave = ItemDetailsForm.mock.calls[2][0].handleSave;
      expect(handleSave).toBeInstanceOf(Function);
      act(() => handleSave(mockObject));

      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(2));
      const dispatch = mockItemDispatch.mock.calls[1][0].dispatch;

      // After save goes back to the previous page
      act(() => dispatch({ type: ApiActions.SuccessAdd }));
      await waitFor(() => expect(mockGoBack).toBeCalledTimes(1));

      done();
    });
  });

  describe("Test Input Conditions for Error Handler2", () => {
    const history = createBrowserHistory();
    let testStore;
    let testShelf;
    beforeEach(() => {
      jest.clearAllMocks();
      history.location.pathname = originalPath;
      history.goBack = mockGoBack;
      testStore = { ...mockStoreProvider };
      testShelf = { ...mockShelfProvider };
    });

    const renderHelper = (storeState, shelfState) =>
      render(
        <Router history={history}>
          <HeaderContext.Provider
            value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
          >
            <AnalyticsContext.Provider value={mockAnalyticsContext}>
              <StoreContext.Provider
                value={{ ...storeState, transaction: false }}
              >
                <ShelfContext.Provider
                  value={{ ...shelfState, transaction: false }}
                >
                  <ItemContext.Provider
                    value={{
                      ...mockItemProvider,
                      transaction: false,
                    }}
                  >
                    <ItemDetailsCreateContainer {...current} />
                  </ItemContext.Provider>
                </ShelfContext.Provider>
              </StoreContext.Provider>
            </AnalyticsContext.Provider>
          </HeaderContext.Provider>
        </Router>
      );

    it("should render false on empty shelves and empty stores", async (done) => {
      renderHelper(testStore, testShelf);
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[5][0];
      expect(call.condition).toBe(false);
      done();
    });

    it("should render false on some shelves and empty stores", async (done) => {
      testShelf.apiObject.inventory = [mockShelf];
      renderHelper(testStore, testShelf);
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[5][0];
      expect(call.condition).toBe(false);
      done();
    });

    it("should render false on empty shelves and some stores", async (done) => {
      testStore.apiObject.inventory = [mockStore];
      renderHelper(testStore, testShelf);
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[5][0];
      expect(call.condition).toBe(false);
      done();
    });

    it("should render true on empty shelves and empty stores", async (done) => {
      testStore.apiObject.inventory = [mockStore];
      testShelf.apiObject.inventory = [mockShelf];
      renderHelper(testStore, testShelf);
      await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(6));
      const call = ErrorHandler.mock.calls[5][0];
      expect(call.condition).toBe(false);
      done();
    });
  });

  describe("during an error", () => {
    const renderHelper = (
      storeContext,
      shelfContext,
      itemContext,
      currentProps
    ) =>
      render(
        <MemoryRouter>
          <HeaderContext.Provider
            value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
          >
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
                    <ItemDetailsCreateContainer {...currentProps} />
                  </ItemContext.Provider>
                </ShelfContext.Provider>
              </StoreContext.Provider>
            </AnalyticsContext.Provider>
          </HeaderContext.Provider>
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
        renderHelper(TestContext, mockShelfProvider, mockItemProvider, current);
      });

      it("renders, update the header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(2);
        expect(mockHeaderUpdate).toHaveBeenLastCalledWith({
          title: current.headerTitle,
          create: null,
          transaction: false,
          disableNav: false,
        });
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(6);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 6);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.messageTranslationKey).toBe(
          "ItemDetails.ApiCommunicationError"
        );
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();

        expect(i18Next.t("ItemDetails.ApiCommunicationError")).toBe(
          Strings.ItemDetails.ApiCommunicationError
        );
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(6); // Three rerenders for API data
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
        renderHelper(mockStoreProvider, TestContext, mockItemProvider, current);
      });

      it("renders, update the header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(2);
        expect(mockHeaderUpdate).toHaveBeenLastCalledWith({
          title: current.headerTitle,
          create: null,
          transaction: false,
          disableNav: false,
        });
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(6);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 6);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.messageTranslationKey).toBe(
          "ItemDetails.ApiCommunicationError"
        );
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();

        expect(i18Next.t("ItemDetails.ApiCommunicationError")).toBe(
          Strings.ItemDetails.ApiCommunicationError
        );
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(6); // Three rerenders for API data
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
        renderHelper(
          mockStoreProvider,
          mockShelfProvider,
          TestContext,
          current
        );
      });

      it("renders, update the header with the correct params", () => {
        expect(mockHeaderUpdate).toHaveBeenCalledTimes(2);
        expect(mockHeaderUpdate).toHaveBeenLastCalledWith({
          title: current.headerTitle,
          create: null,
          transaction: false,
          disableNav: false,
        });
      });

      it("renders, calls the ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(6);

        const errorHandlerCall = ErrorHandler.mock.calls[0][0];
        propCount(errorHandlerCall, 6);
        expect(errorHandlerCall.condition).toBe(true);
        expect(errorHandlerCall.clearError).toBeInstanceOf(Function);
        expect(errorHandlerCall.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(errorHandlerCall.messageTranslationKey).toBe(
          "ItemDetails.ApiCommunicationError"
        );
        expect(errorHandlerCall.redirect).toBe(Routes.goBack);
        expect(errorHandlerCall.children).toBeTruthy();

        expect(i18Next.t("ItemDetails.ApiCommunicationError")).toBe(
          Strings.ItemDetails.ApiCommunicationError
        );
      });

      it("renders, clear error works as expected", async (done) => {
        expect(ErrorHandler).toHaveBeenCalledTimes(6); // Three rerenders for API data
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
  });
});
