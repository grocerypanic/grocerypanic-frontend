import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createBrowserHistory } from "history";
import i18next from "i18next";
import React from "react";
import { Router } from "react-router-dom";
import { Constants } from "../../../configuration/backend";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import { ItemizedBanner } from "../../../global-styles/banner";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import calculateMaxHeight from "../../../util/height";
import Alert from "../../alert/alert.component";
import ErrorHandler from "../../error-handler/error-handler.component";
import Hint from "../../hint/hint.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import Pagination from "../../pagination/pagination.component";
import InlineList, { createItemDefaults } from "../inline-list.component";
import InlineListForm from "../inline-list.form/inline-list.form.component";
import InlineListItem from "../inline-list.item/inline-list.item.component";

jest.mock("../../holding-pattern/holding-pattern.component");
jest.mock("../inline-list.form/inline-list.form.component");
jest.mock("../inline-list.item/inline-list.item.component");
jest.mock("../../hint/hint.component");
jest.mock("../../../util/height");
jest.mock("../../error-handler/error-handler.component");
jest.mock("../../pagination/pagination.component");
jest.mock("../../alert/alert.component");
jest.mock("../../../global-styles/banner", () => ({
  __esModule: true,
  ItemizedBanner: jest.fn(),
}));

jest.mock("../../../configuration/theme", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../../configuration/theme"),
    ui: { alertTimeout: 10 },
  };
});

Alert.mockImplementation(() => <div>MockAlert</div>);
ErrorHandler.mockImplementation(({ children }) => children);
HoldingPattern.mockImplementation(({ children }) => children);
InlineListItem.mockImplementation(() => <div>MockListItem</div>);
InlineListForm.mockImplementation(() => <div>MockListItemForm</div>);
Hint.mockImplementation(() => <div>MockHelp</div>);
Pagination.mockImplementation(() => <div>MockPagination</div>);
calculateMaxHeight.mockImplementation(() => 200);
ItemizedBanner.mockImplementation(() => <div>MockBanner</div>);

const mockHeaderUpdate = jest.fn();
const mockDispatch = jest.fn();

const mockInventoryData = [
  { id: 1, name: "Shelf1" },
  { id: 2, name: "Shelf2" },
  { id: 3, name: "Shelf3" },
];

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

const mockInitialAPIObjectState = {
  inventory: [...mockInventoryData],
  class: "shelf",
  transaction: false,
  fail: false,
  errorMsg: null,
};
const MockApiContext = React.createContext({
  apiObject: mockInitialAPIObjectState,
  dispatch: mockDispatch,
});

describe("InlineList", () => {
  let mockProps = {
    title: "Some Title",
    headerTitle: "Some Header Title",
    placeHolderMessage: "Holding a Place",
    handleCreate: jest.fn(),
    handleExpiredAuth: jest.fn(),
    redirectTag: "store",
  };
  const history = createBrowserHistory({ basename: Routes.root });
  const originalWindow = window.location;
  let currentAPIData;
  let mockPaginationOffset;
  let container;

  beforeEach(() => {
    setUrl("https://myserver.com:8080");
    jest.clearAllMocks();
    currentAPIData = {
      ...cloneInitialState(),
    };
  });

  afterAll(() => {
    window.location = originalWindow;
  });

  const setUrl = (url) => {
    delete window.location;
    window.location = new URL(url);
  };

  const cloneInitialState = () =>
    JSON.parse(JSON.stringify(mockInitialAPIObjectState));

  const arrange = (currentProps) => {
    const result = render(
      <Router history={history}>
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <HeaderContext.Provider
            value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
          >
            <MockApiContext.Provider
              value={{
                apiObject: currentProps,
                dispatch: mockDispatch,
              }}
            >
              <InlineList
                title={mockProps.title}
                headerTitle={mockProps.headerTitle}
                create={mockProps.create}
                transaction={currentProps.transaction}
                ApiObjectContext={MockApiContext}
                placeHolderMessage={mockProps.placeHolderMessage}
                handleExpiredAuth={mockProps.handleExpiredAuth}
                helpText={Strings.Testing.GenericTranslationTestString}
                redirectTag={mockProps.redirectTag}
              />
            </MockApiContext.Provider>
          </HeaderContext.Provider>
        </AnalyticsContext.Provider>
      </Router>
    );
    container = result.container;
  };

  const checkBasicComponents = () => {
    it("should update the Header with the correct params", () => {
      expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
      const headerCall = mockHeaderUpdate.mock.calls[0][0];
      expect(headerCall.title).toBe(mockProps.headerTitle);
      expect(headerCall.create).toBeInstanceOf(Function);
      expect(headerCall.transaction).toBe(currentAPIData.transaction);
      expect(headerCall.disableNav).toBe(false);
    });

    it("should call the ErrorHandler with the correct params", () => {
      expect(ErrorHandler).toHaveBeenCalledTimes(1);
      const call = ErrorHandler.mock.calls[0][0];
      propCount(call, 6);
      expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
      expect(call.condition).toBe(currentAPIData.fail);
      expect(call.clearError).toBeInstanceOf(Function);
      expect(call.messageTranslationKey).toBe(
        "InlineList.ApiCommunicationError"
      );
      expect(call.redirect).toBe(Routes.goBack);
      expect(call.children).toBeTruthy();
    });

    it("should call the HoldingPattern spinner with the correct params", () => {
      expect(HoldingPattern).toHaveBeenCalledTimes(1);
      const holdingPatternCall = HoldingPattern.mock.calls[0][0];
      propCount(holdingPatternCall, 2);
      expect(holdingPatternCall.condition).toBe(true);
    });

    it("should call Pagination with the correct params", () => {
      expect(Pagination).toHaveBeenCalledTimes(1);
      const pagination = Pagination.mock.calls[0][0];
      propCount(pagination, 2);
      expect(pagination.apiObject).toStrictEqual(currentAPIData);
      expect(pagination.handlePagination).toBeInstanceOf(Function);
    });

    it("should translate InlineList.ApiCommunicationError correctly", () => {
      expect(i18next.t("InlineList.ApiCommunicationError")).toBe(
        Strings.InlineList.ApiCommunicationError
      );
    });

    it("should call calculateMaxHeight", () => {
      expect(calculateMaxHeight).toBeCalledTimes(1);
    });

    describe("when the screen is resized", () => {
      beforeEach(() => {
        fireEvent(window, new Event("resize"));
      });

      it("should call calculateMaxHeight a second time", async () => {
        await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
      });
    });
  };

  describe("when there is NOT a transaction", () => {
    beforeEach(() => (currentAPIData.transaction = false));

    describe("when there is NOT an api failure", () => {
      beforeEach(() => (currentAPIData.fail = false));

      describe("when there are NO items in the list", () => {
        beforeEach(() => {
          currentAPIData.inventory = [];
          arrange(currentAPIData);
        });

        it("should display the mockPlaceHolderMessage", () => {
          expect(screen.getByText(mockProps.placeHolderMessage)).toBeTruthy();
        });

        it("should NOT call InlineListItem", () => {
          expect(InlineListItem).toBeCalledTimes(0);
        });

        checkBasicComponents();

        it("should call StartList on first render", () => {
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          const apiCall = mockDispatch.mock.calls[0][0];
          propCount(apiCall, 5);
          expect(apiCall.type).toBe(ApiActions.StartList);
          expect(apiCall.func).toBe(ApiFunctions.asyncList);
          expect(apiCall.dispatch).toBeInstanceOf(Function);
          expect(apiCall.callback).toBeInstanceOf(Function);
          expect(apiCall.page).toBeNull();
        });

        it("should match the snapshot on file (styles)", () => {
          expect(container).toMatchSnapshot();
        });

        describe("when a new item is created", () => {
          beforeEach(async () => {
            await waitFor(() => expect(mockHeaderUpdate).toBeCalledTimes(1));
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
            const handleCreate = mockHeaderUpdate.mock.calls[0][0].create;
            act(() => handleCreate());
          });

          it("should call ListItemForm", async () => {
            await waitFor(() => expect(InlineListForm).toBeCalledTimes(1));
            const call = InlineListForm.mock.calls[0][0];
            propCount(call, 5);
            expect(call.item).toBe(createItemDefaults);
            expect(call.handleSave).toBeInstanceOf(Function);
            expect(call.setErrorMsg).toBeInstanceOf(Function);
            expect(call.setSelected).toBeInstanceOf(Function);
            expect(call.transaction).toBe(currentAPIData.transaction);
          });
        });
      });

      describe("when there are items in the list", () => {
        beforeEach(() => (currentAPIData.inventory = [...mockInventoryData]));

        const checkInlineListItem = (index) => {
          const call = InlineListItem.mock.calls[index][0];
          expect(call.item).toBe(currentAPIData.inventory[index]);
          expect(typeof call.handleDelete).toBe("function");
          expect(call.history).toBe(history);
          expect(call.objectClass).toBe(currentAPIData.class);
          expect(call.transaction).toBe(currentAPIData.transaction);
          expect(call.redirectTag).toBe(mockProps.redirectTag);
          expect(call.selected).toBe(null);
          expect(typeof call.setCreated).toBe("function");
          expect(typeof call.setSelected).toBe("function");
          propCount(call, 9);
        };

        const checkInlineListItems = () => {
          it("should call the InlineListItem for each item", () => {
            expect(InlineListItem).toBeCalledTimes(
              currentAPIData.inventory.length
            );
            currentAPIData.inventory.map((_, index) =>
              checkInlineListItem(index)
            );
          });
        };

        it("should match the snapshot on file (styles)", () => {
          expect(container).toMatchSnapshot();
        });

        describe("when an API authentication error occurs", () => {
          beforeEach(() => {
            arrange(currentAPIData);
          });

          it("should match the snapshot on file (styles)", () => {
            expect(container).toMatchSnapshot();
          });

          it("renders, and handles an auth failure condition as expected", async () => {
            const { handleDelete } = InlineListItem.mock.calls[0][0];

            act(() => {
              handleDelete(2);
            });

            await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(2));
            await waitFor(() => expect(Alert).toHaveBeenCalledTimes(3));

            const apiCall = mockDispatch.mock.calls[1][0];
            const setPerformAsync = apiCall.dispatch;

            act(() => {
              setPerformAsync({ type: ApiActions.FailureAuth });
            });

            await waitFor(() =>
              expect(mockProps.handleExpiredAuth).toHaveBeenCalledTimes(1)
            );
          });
        });

        describe("when the page has a pagination reference", () => {
          beforeEach(() => {
            mockPaginationOffset = "2";
            setUrl(
              `https://myserver.com:8080?${Constants.pageLookupParam}=${mockPaginationOffset}`
            );
            arrange(currentAPIData);
          });

          it("should NOT display the mockPlaceHolderMessage", () => {
            expect(screen.queryByText(mockProps.placeHolderMessage)).toBeNull();
          });

          checkBasicComponents();
          checkInlineListItems();

          it("should call StartList on first render, with the page param", () => {
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            const apiCall = mockDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartList);
            expect(apiCall.func).toBe(ApiFunctions.asyncList);
            expect(apiCall.dispatch).toBeInstanceOf(Function);
            expect(apiCall.callback).toBeInstanceOf(Function);
            expect(apiCall.page).toBe(mockPaginationOffset);
          });

          it("should match the snapshot on file (styles)", () => {
            expect(container).toMatchSnapshot();
          });
        });

        describe("when the page does NOT have a pagination reference", () => {
          beforeEach(() => {
            arrange(currentAPIData);
          });

          it("should NOT display the mockPlaceHolderMessage", () => {
            expect(screen.queryByText(mockProps.placeHolderMessage)).toBeNull();
          });

          checkBasicComponents();
          checkInlineListItems();

          it("should call StartList on first render, with the page param", () => {
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            const apiCall = mockDispatch.mock.calls[0][0];
            propCount(apiCall, 5);
            expect(apiCall.type).toBe(ApiActions.StartList);
            expect(apiCall.func).toBe(ApiFunctions.asyncList);
            expect(apiCall.dispatch).toBeInstanceOf(Function);
            expect(apiCall.callback).toBeInstanceOf(Function);
            expect(apiCall.page).toBeNull();
          });

          it("should match the snapshot on file (styles)", () => {
            expect(container).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe("when there is an API failure", () => {
    beforeEach(() => {
      currentAPIData.fail = true;
      arrange(currentAPIData);
    });

    checkBasicComponents();
  });

  describe("when there is a transaction", () => {
    beforeEach(() => {
      currentAPIData.transaction = true;
      arrange(currentAPIData);
    });

    checkBasicComponents();

    it("should match the snapshot on file (styles)", () => {
      expect(container).toMatchSnapshot();
    });

    describe("simulated error scenarios", () => {
      describe("create item scenario", () => {
        beforeEach(async () => {
          await waitFor(() => expect(mockHeaderUpdate).toBeCalledTimes(1));
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          const handleCreate = mockHeaderUpdate.mock.calls[0][0].create;
          handleCreate();
        });

        it("should NOT call ListItemForm", async () => {
          expect(InlineListForm).toBeCalledTimes(0);
        });
      });

      describe("delete item scenario", () => {
        beforeEach(async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          await waitFor(() => expect(InlineListItem).toBeCalledTimes(3));
          const handleDelete = InlineListItem.mock.calls[0][0].handleDelete;
          handleDelete(0, "Not A Real Item");
        });

        it("should should NOT dispatch for the delete", () => {
          expect(mockDispatch).toBeCalledTimes(1);
        });
      });
    });
  });
});
