import React from "react";
import {
  render,
  cleanup,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ErrorHandler from "../../error-handler/error-handler.component";
import Header from "../../header/header.component";
import Help from "../../simple-list-help/simple-list-help.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";

import {
  AnalyticsActions,
  IndexedAnalyticsActions,
} from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";

import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import SimpleListItem from "../../simple-list-item/simple-list-item.component";
import SimpleList from "../simple-list.component";

import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import calculateMaxHeight from "../../../util/height";

jest.mock("../../holding-pattern/holding-pattern.component");
jest.mock("../../simple-list-item/simple-list-item.component");
jest.mock("../../header/header.component");
jest.mock("../../simple-list-help/simple-list-help.component");
jest.mock("../../../util/height");
jest.mock("../../error-handler/error-handler.component");

ErrorHandler.mockImplementation(({ children }) => children);
HoldingPattern.mockImplementation(({ children }) => children);
SimpleListItem.mockImplementation(() => <div>MockListItem</div>);
Header.mockImplementation(() => <div>MockHeader</div>);
Help.mockImplementation(() => <div>MockHelp</div>);
calculateMaxHeight.mockImplementation(() => 200);

const mockDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();
const mockRedirectTag = "store";

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

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

const mockPlaceHolderMessage = "I'm Right Here";

describe("Setup Environment", () => {
  let utils;
  const mockTitle = "Some Title";
  const mockHeaderTitle = "Some Header Title";
  const create = jest.fn();
  let ApiContext;
  let apiObjectState;
  let current;

  beforeEach(() => {
    jest.clearAllMocks();

    apiObjectState = {
      inventory: mockData,
      class: "shelf",
      ...mockDataState,
    };

    ApiContext = React.createContext({
      apiObject: apiObjectState,
      dispatch: mockDispatch,
    });
  });

  afterEach(cleanup);

  const validateFunctions = (call) => {
    expect(call.listFunctions.setSelected).toBeInstanceOf(Function);
    expect(call.listFunctions.setErrorMsg).toBeInstanceOf(Function);
    expect(call.listFunctions.setCreated).toBeInstanceOf(Function);
    expect(call.listFunctions.setLongPress).toBeInstanceOf(Function);
    expect(call.listFunctions.add).toBeInstanceOf(Function);
    expect(call.listFunctions.del).toBeInstanceOf(Function);
    expect(call.listFunctions.setActionMsg).toBeInstanceOf(Function);

    expect(call.listFunctions.setErrorMsg.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setSelected.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setCreated.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setLongPress.name).toBe("bound dispatchAction");
    expect(call.listFunctions.setActionMsg.name).toBe("bound dispatchAction");
    expect(call.listFunctions.add.name).toBe("handleSave");
    expect(call.listFunctions.del.name).toBe("handleDelete");
  };

  describe("outside of a transaction", () => {
    describe("outside of an api error", () => {
      describe("no items in the list", () => {
        beforeEach(() => {
          current = { ...apiObjectState, transaction: false, inventory: [] };
          utils = render(
            <ApiContext.Provider
              value={{
                apiObject: current,
                dispatch: mockDispatch,
              }}
            >
              <SimpleList
                title={mockTitle}
                headerTitle={mockHeaderTitle}
                create={create}
                transaction={current.transaction}
                ApiObjectContext={ApiContext}
                placeHolderMessage={mockPlaceHolderMessage}
                handleExpiredAuth={mockHandleExpiredAuth}
                helpText={Strings.Testing.GenericTranslationTestString}
                redirectTag={mockRedirectTag}
                waitForApi={false}
              />
              }}
            </ApiContext.Provider>
          );
        });

        it("renders, outside of a transaction, with no items in the list, and renders the mockPlaceHolderMessage", () => {
          expect(current.transaction).toBe(false);

          expect(SimpleListItem).toBeCalledTimes(0);
          expect(Header).toHaveBeenCalledTimes(1);

          expect(utils.getByText(mockPlaceHolderMessage)).toBeTruthy();
        });

        it("renders, and skips the holding pattern to trigger the spinner", async (done) => {
          expect(Header).toHaveBeenCalledTimes(1);
          expect(HoldingPattern).toHaveBeenCalledTimes(1);
          const holdingPatternCall = HoldingPattern.mock.calls[0][0];
          propCount(holdingPatternCall, 2);
          expect(holdingPatternCall.condition).toBe(false);
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

        it("renders, should call the error handler with the correct params", async (done) => {
          await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(1));
          const call = ErrorHandler.mock.calls[0][0];
          propCount(call, 7);
          expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
          expect(call.condition).toBe(false);
          expect(call.clearError).toBeInstanceOf(Function);
          expect(call.stringsRoot).toBe(Strings.SimpleList);
          expect(call.string).toBe("ApiCommunicationError");
          expect(call.redirect).toBe(Routes.goBack);
          expect(call.children).toBeTruthy();
          done();
        });
      });

      describe("3 items in the list", () => {
        beforeEach(() => {
          current = { ...apiObjectState, transaction: false };
          utils = render(
            <AnalyticsContext.Provider value={mockAnalyticsContext}>
              <ApiContext.Provider
                value={{
                  apiObject: current,
                  dispatch: mockDispatch,
                }}
              >
                <SimpleList
                  title={mockTitle}
                  headerTitle={mockHeaderTitle}
                  create={create}
                  transaction={current.transaction}
                  ApiObjectContext={ApiContext}
                  placeHolderMessage={mockPlaceHolderMessage}
                  handleExpiredAuth={mockHandleExpiredAuth}
                  helpText={Strings.Testing.GenericTranslationTestString}
                  redirectTag={mockRedirectTag}
                  waitForApi={false}
                />
                }}
              </ApiContext.Provider>
            </AnalyticsContext.Provider>
          );
        });

        it("renders, calls StartList on first render", async (done) => {
          expect(current.transaction).toBeFalsy();
          await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
          const apiCall = mockDispatch.mock.calls[0][0];
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartList);
          expect(apiCall.func).toBe(ApiFunctions.asyncList);
          expect(apiCall.dispatch).toBeInstanceOf(Function);
          expect(apiCall.callback).toBeInstanceOf(Function);
          done();
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

        it("renders, outside of a transaction should call help with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(Help).toHaveBeenCalledTimes(1);

          const helpCall = Help.mock.calls[0][0];
          propCount(helpCall, 1);
          expect(helpCall.children).toBe(
            Strings.Testing.GenericTranslationTestString
          );
        });

        it("renders, outside of a transaction should call the simple list component(s) with the correct params", () => {
          expect(current.transaction).toBe(false);

          expect(SimpleListItem).toHaveBeenCalledTimes(3);

          const call1 = SimpleListItem.mock.calls[0][0];
          propCount(call1, 5);
          propCount(call1.listFunctions, 7);
          propCount(call1.listValues, 4);

          expect(call1.item).toBe(mockData[0]);
          expect(call1.allItems).toBe(mockData);
          expect(call1.redirectTag).toBe(mockRedirectTag);

          expect(call1.listValues.selected).toBe(null);
          expect(call1.listValues.errorMsg).toBe(null);
          expect(call1.listValues.transaction).toBe(false);
          expect(call1.listValues.longPress).toBe(false);

          validateFunctions(call1);

          const call2 = SimpleListItem.mock.calls[1][0];
          propCount(call2, 5);
          propCount(call2.listFunctions, 7);
          propCount(call2.listValues, 4);

          expect(call2.item).toBe(mockData[1]);
          expect(call2.allItems).toBe(mockData);
          expect(call2.redirectTag).toBe(mockRedirectTag);

          expect(call2.listValues.selected).toBe(null);
          expect(call2.listValues.errorMsg).toBe(null);
          expect(call2.listValues.transaction).toBe(false);
          expect(call2.listValues.longPress).toBe(false);

          validateFunctions(call2);

          const call3 = SimpleListItem.mock.calls[2][0];
          propCount(call3, 5);
          propCount(call3.listFunctions, 7);
          propCount(call3.listValues, 4);
          expect(call3.redirectTag).toBe(mockRedirectTag);

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
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartAdd);
          expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
          expect(apiCall.payload).toStrictEqual({ name: "shelfname" });
          expect(apiCall.dispatch).toBeInstanceOf(Function);

          expect(mockAnalyticsContext.event).toBeCalledWith(
            IndexedAnalyticsActions.shelf.create
          );

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
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartAdd);
          expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
          expect(apiCall.payload).toStrictEqual({ name: "shelfname" });
          expect(apiCall.dispatch).toBeInstanceOf(Function);

          expect(mockAnalyticsContext.event).toBeCalledWith(
            IndexedAnalyticsActions.shelf.create
          );

          done();
        });

        it("renders, and dispatches the API reducer when handleDelete is called", async (done) => {
          expect(SimpleListItem).toHaveBeenCalledTimes(3);
          const { del } = SimpleListItem.mock.calls[0][0].listFunctions;
          expect(current.transaction).toBeFalsy();

          act(() => {
            del(2);
          });

          await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(2));
          expect(mockDispatch.mock.calls[0][0].type).toBe(ApiActions.StartList);

          const apiCall = mockDispatch.mock.calls[1][0];
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartDel);
          expect(apiCall.func).toBe(ApiFunctions.asyncDel);
          expect(apiCall.payload.id).toBe(2);
          expect(apiCall.dispatch).toBeInstanceOf(Function);

          expect(mockAnalyticsContext.event).toBeCalledWith(
            IndexedAnalyticsActions.shelf.delete
          );

          done();
        });

        it("renders, and handles an auth failure condition as expected", async (done) => {
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

          await waitFor(() =>
            expect(mockHandleExpiredAuth).toHaveBeenCalledTimes(1)
          );

          done();
        });

        it("renders, and skips the holding pattern to trigger the spinner", async (done) => {
          expect(Header).toHaveBeenCalledTimes(1);
          expect(HoldingPattern).toHaveBeenCalledTimes(1);
          const holdingPatternCall = HoldingPattern.mock.calls[0][0];
          propCount(holdingPatternCall, 2);
          expect(holdingPatternCall.condition).toBe(false);
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

        it("renders, should call the error handler with the correct params", async (done) => {
          await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(1));
          const call = ErrorHandler.mock.calls[0][0];
          propCount(call, 7);
          expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
          expect(call.condition).toBe(false);
          expect(call.clearError).toBeInstanceOf(Function);
          expect(call.stringsRoot).toBe(Strings.SimpleList);
          expect(call.string).toBe("ApiCommunicationError");
          expect(call.redirect).toBe(Routes.goBack);
          expect(call.children).toBeTruthy();
          done();
        });
      });
    });

    describe("during an api error", () => {
      beforeEach(() => {
        current = { ...apiObjectState, transaction: false, error: true };
        utils = render(
          <AnalyticsContext.Provider value={mockAnalyticsContext}>
            <ApiContext.Provider
              value={{
                apiObject: current,
                dispatch: mockDispatch,
              }}
            >
              <SimpleList
                title={mockTitle}
                headerTitle={mockHeaderTitle}
                create={create}
                transaction={current.transaction}
                ApiObjectContext={ApiContext}
                placeHolderMessage={mockPlaceHolderMessage}
                handleExpiredAuth={mockHandleExpiredAuth}
                helpText={Strings.Testing.GenericTranslationTestString}
                redirectTag={mockRedirectTag}
              />
              }}
            </ApiContext.Provider>
          </AnalyticsContext.Provider>
        );
      });
      it("renders, should call the error handler with the correct params", async (done) => {
        await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(1));
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 7);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.condition).toBe(true);
        expect(call.clearError).toBeInstanceOf(Function);
        expect(call.stringsRoot).toBe(Strings.SimpleList);
        expect(call.string).toBe("ApiCommunicationError");
        expect(call.redirect).toBe(Routes.goBack);
        expect(call.children).toBeTruthy();
        done();
      });

      it("renders, handles a call to clear errors as expected", async (done) => {
        await waitFor(() => expect(ErrorHandler).toHaveBeenCalledTimes(1));
        const call = ErrorHandler.mock.calls[0][0];
        act(() => call.clearError());
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch.mock.calls[1][0].type).toBe(ApiActions.ClearErrors);
        done();
      });
    });
  });

  describe("during a transaction", () => {
    beforeEach(() => {
      current = { ...apiObjectState, transaction: true };
      utils = render(
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <ApiContext.Provider
            value={{
              apiObject: current,
              dispatch: mockDispatch,
            }}
          >
            <SimpleList
              title={mockTitle}
              headerTitle={mockHeaderTitle}
              create={create}
              transaction={current.transaction}
              ApiObjectContext={ApiContext}
              placeHolderMessage={mockPlaceHolderMessage}
              handleExpiredAuth={mockHandleExpiredAuth}
              helpText={Strings.Testing.GenericTranslationTestString}
              redirectTag={mockRedirectTag}
              waitForApi={false}
            />
            }}
          </ApiContext.Provider>
        </AnalyticsContext.Provider>
      );
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

    it("renders, and skips the holding pattern to trigger the spinner", async (done) => {
      expect(Header).toHaveBeenCalledTimes(1);
      expect(HoldingPattern).toHaveBeenCalledTimes(1);
      const holdingPatternCall = HoldingPattern.mock.calls[0][0];
      propCount(holdingPatternCall, 2);
      expect(holdingPatternCall.condition).toBe(false);
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

  describe("pending api load", () => {
    beforeEach(() => {
      current = { ...apiObjectState, transaction: true };
      utils = render(
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <ApiContext.Provider
            value={{
              apiObject: current,
              dispatch: mockDispatch,
            }}
          >
            <SimpleList
              title={mockTitle}
              headerTitle={mockHeaderTitle}
              create={create}
              transaction={current.transaction}
              ApiObjectContext={ApiContext}
              placeHolderMessage={mockPlaceHolderMessage}
              handleExpiredAuth={mockHandleExpiredAuth}
              helpText={Strings.Testing.GenericTranslationTestString}
              redirectTag={mockRedirectTag}
            />
            }}
          </ApiContext.Provider>
        </AnalyticsContext.Provider>
      );
    });
    it("renders, and loads the holding pattern to trigger the spinner", async (done) => {
      expect(Header).toHaveBeenCalledTimes(1);
      expect(HoldingPattern).toHaveBeenCalledTimes(1);
      const holdingPatternCall = HoldingPattern.mock.calls[0][0];
      propCount(holdingPatternCall, 2);
      expect(holdingPatternCall.condition).toBe(true);
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
