import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { FilterTag } from "../../../configuration/backend";
import Routes from "../../../configuration/routes";
import Strings from "../../../configuration/strings";
import { IndexedAnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";
import HeaderProvider from "../../../providers/header/header.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import calculateMaxHeight from "../../../util/height";
import Header from "../../header/header.component";
import InlineList from "../inline-list.component";
import { testIDs as itemTestIDs } from "../inline-list.item/inline-list.item.component";

jest.mock("../../../util/height");

jest.mock("../../../configuration/theme", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../../configuration/theme"),
    ui: { alertTimeout: 200 },
  };
});

calculateMaxHeight.mockImplementation(() => 200);

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
  class: "store",
  transaction: false,
  fail: false,
  errorMsg: null,
};
const MockApiContext = React.createContext({
  apiObject: mockInitialAPIObjectState,
  dispatch: mockDispatch,
});

describe("InlineList", () => {
  const history = createBrowserHistory({ basename: Routes.root });
  history.push = jest.fn();
  let mockProps = {
    title: "Some Title",
    headerTitle: "Some Header Title",
    placeHolderMessage: "Holding a Place",
    handleCreate: jest.fn(),
    handleExpiredAuth: jest.fn(),
    redirectTag: "store",
  };
  const originalWindow = window.location;
  let currentAPIData;

  beforeEach(() => {
    jest.clearAllMocks();
    currentAPIData = {
      ...cloneInitialState(),
    };
    setUrl("https://myserver.com:8080");
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

  const arrange = async (currentProps) => {
    render(
      <Router history={history}>
        <AnalyticsContext.Provider value={mockAnalyticsContext}>
          <HeaderProvider>
            <MockApiContext.Provider
              value={{
                apiObject: currentProps,
                dispatch: mockDispatch,
              }}
            >
              <Header />
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
          </HeaderProvider>
        </AnalyticsContext.Provider>
      </Router>
    );

    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    const callback = mockDispatch.mock.calls[0][0].callback;
    act(() =>
      callback({
        success: true,
        complete: true,
      })
    );
  };

  const clickAddButton = async () => {
    const addButton = await screen.findByTestId("AddIcon");
    fireEvent.click(addButton);
  };

  const clickItem = (item) => {
    const title = screen.getByText(item.name);
    fireEvent.mouseDown(title.parentElement);
    fireEvent.mouseUp(title.parentElement);
    setTimeout(() => {
      fireEvent.click(title);
    }, 100);
  };

  const clickLongItem = async (item) => {
    const itemElement = await screen.findByText(item.name);
    fireEvent.mouseDown(itemElement);
  };

  const flashActionMessage = async (msg) => {
    expect(await screen.findByText(msg)).toBeTruthy();
    await waitFor(() => expect(screen.queryByText(msg)).toBeNull());
  };

  const flashErrorMessage = async (msg) => {
    expect(await screen.findByText(msg)).toBeTruthy();
    await waitFor(() => expect(screen.queryByText(msg)).toBeNull());
    const alert = await screen.findByTestId("alert");
    await waitFor(() => expect(alert.innerHTML).toBe("&nbsp;"));
  };

  const scenarioAddItem = () => {
    let objectName;

    const clickAddButton = async () => {
      const addButton = await screen.findByTestId("AddIcon");
      fireEvent.click(addButton);
    };

    const clickSaveItem = async () => {
      const saveButton = await screen.findByTestId(
        itemTestIDs.ListItemSaveButton
      );
      fireEvent.click(saveButton);
    };

    const enterText = () => {
      const element = screen.getByTestId(
        itemTestIDs.ListItemNewItemInputElement
      );
      fireEvent.change(element, { target: { value: objectName } });
    };

    describe("when the header's + button is pressed", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
        await clickAddButton();
      });

      it("should generate a new blank item", async () => {
        expect(
          await screen.findByTestId(itemTestIDs.ListItemNewItemInputElement)
        ).toBeTruthy();
      });

      it("should display save button", async () => {
        expect(
          await screen.findByTestId(itemTestIDs.ListItemSaveButton)
        ).toBeTruthy();
      });
    });

    describe("SEQUENCE: when the new item is Saved", () => {
      beforeEach(async () => {
        currentAPIData.transaction = false;
        await arrange(currentAPIData);
      });

      describe("with a VALID name", () => {
        beforeEach(async () => {
          objectName = "Test Shelf";
          await clickAddButton();
          enterText();
          await clickSaveItem();
        });

        it("should call the dispatch function with StartAdd", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          const apiCall = mockDispatch.mock.calls[1][0];
          propCount(apiCall, 4);
          expect(apiCall.type).toBe(ApiActions.StartAdd);
          expect(apiCall.func).toBe(ApiFunctions.asyncAdd);
          expect(apiCall.payload).toStrictEqual({ name: objectName });
          expect(apiCall.dispatch).toBeInstanceOf(Function);
        });

        describe("when the SuccessAdd message is generated", () => {
          beforeEach(async () => {
            const dispatch = mockDispatch.mock.calls[1][0].dispatch;
            act(() => dispatch({ type: ApiActions.SuccessAdd }));
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(3));
            expect(mockDispatch.mock.calls[2][0].type).toBe(
              ApiActions.SuccessAdd
            );
            await flashActionMessage(
              `${Strings.InlineList.CreatedAction} ${objectName}`
            );
          });

          it("should generate an analytics event", async () => {
            await waitFor(() =>
              expect(mockAnalyticsContext.event).toBeCalledTimes(1)
            );
            expect(mockAnalyticsContext.event).toBeCalledWith(
              IndexedAnalyticsActions.store.create
            );
          });

          it("should hide the blank item entry", () => {
            expect(
              screen.queryByTestId(itemTestIDs.ListItemNewItemInputElement)
            ).toBeNull();
          });
        });
      });

      describe("with an INVALID name", () => {
        beforeEach(async () => {
          objectName = ".";
          await clickAddButton();
          enterText();
          await clickSaveItem();
          await flashErrorMessage(Strings.InlineList.ValidationFailure);
        });

        it("should NOT call the dispatch function with StartAdd", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          const apiCall = mockDispatch.mock.calls[0][0];
          expect(apiCall.type).not.toBe(ApiActions.StartAdd);
        });

        it("should NOT generate an analytics event", () => {
          expect(mockAnalyticsContext.event).toBeCalledTimes(0);
        });
      });
    });
  };

  const scenarioAddItemDisabled = () => {
    describe("when looking for the header's + button", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
      });

      it("should NOT be visible during a transaction", async () => {
        await screen.findByTestId("AddSpinner");
      });

      describe("when the header's + button is pressed anyways", () => {
        beforeEach(async () => {
          await clickAddButton();
        });

        it("should NOT generate a new blank item", () => {
          expect(
            screen.queryByTestId(itemTestIDs.ListItemNewItemInputElement)
          ).toBeNull();
        });
      });
    });
  };

  const scenarioDeleteItem = () => {
    const clickDeleteButton = async () => {
      const deleteButton = await screen.findByTestId(
        itemTestIDs.ListItemDeleteButton
      );
      fireEvent.click(deleteButton);
    };

    const getItem = () => currentAPIData.inventory[0];

    describe("when an item is clicked for a long time", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
      });

      it("the delete button should become visible", async () => {
        await clickLongItem(getItem());
        await screen.findByTestId(itemTestIDs.ListItemDeleteButton);
      });
    });

    describe("SEQUENCE: delete an item", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
        await clickLongItem(getItem());
        await clickDeleteButton();
      });

      it("should dispatch a delete item event", async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        const apiCall = mockDispatch.mock.calls[1][0];
        propCount(apiCall, 4);
        expect(apiCall.type).toBe(ApiActions.StartDel);
        expect(apiCall.func).toBe(ApiFunctions.asyncDel);
        expect(apiCall.payload).toStrictEqual({
          id: getItem().id,
        });
        expect(apiCall.dispatch).toBeInstanceOf(Function);
      });

      describe("when the SuccessDel message is generated", () => {
        beforeEach(async () => {
          const dispatch = mockDispatch.mock.calls[1][0].dispatch;
          act(() => dispatch({ type: ApiActions.SuccessDel }));
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(3));
          expect(mockDispatch.mock.calls[2][0].type).toBe(
            ApiActions.SuccessDel
          );
          await flashActionMessage(
            `${Strings.InlineList.DeletedAction} ${getItem().name}`
          );
        });

        it("should generate an analytics event", async () => {
          await waitFor(() =>
            expect(mockAnalyticsContext.event).toBeCalledTimes(1)
          );
          expect(mockAnalyticsContext.event).toBeCalledWith(
            IndexedAnalyticsActions.store.delete
          );
        });
      });
    });
  };

  const scenarioDeleteItemDisabled = () => {
    const getItem = () => currentAPIData.inventory[0];

    describe("when an item is clicked for a long time", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
      });

      it("the delete button should NOT become visible", async () => {
        await clickLongItem(getItem());
        expect(
          screen.queryByTestId(itemTestIDs.ListItemDeleteButton)
        ).toBeNull();
      });
    });
  };

  const scenarioRouteToItem = () => {
    describe("SEQUENCE: clicking on each item's title", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
      });

      const createItemUrl = (item) => {
        const params = {};
        params[FilterTag] = item.name;
        params[mockProps.redirectTag] = item.id;
        params.class = currentAPIData.class;
        return `${Routes.items}?${new URLSearchParams(params).toString()}`;
      };

      it("should route to that item's page when clicked", async () => {
        expect(history.push).toBeCalledTimes(0);
        for (const item of currentAPIData.inventory) {
          const url = createItemUrl(item);
          clickItem(item);
          await waitFor(() => expect(history.push).toBeCalledWith(url));
        }
      });
    });
  };

  const scenarioRouteToItemDisabled = () => {
    describe("SEQUENCE: clicking on each item's title", () => {
      beforeEach(async () => {
        await arrange(currentAPIData);
      });

      it("should NOT route to that item's page when clicked", async () => {
        expect(history.push).toBeCalledTimes(0);
        for (const item of currentAPIData.inventory) {
          clickItem(item);
        }
        expect(history.push).toBeCalledTimes(0);
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
        });

        describe("before running scenarios", () => {
          beforeEach(async () => {
            await arrange(currentAPIData);
          });

          it("should display the mockPlaceHolderMessage", () => {
            expect(screen.getByText(mockProps.placeHolderMessage)).toBeTruthy();
          });

          it("should NOT display the HoldingPattern spinner", () => {
            expect(screen.queryByTestId("HoldingPattern")).toBeNull();
          });
        });

        describe("SCENARIO: add item", () => {
          scenarioAddItem();
        });
      });

      describe("when there are items in the list", () => {
        beforeEach(() => {
          currentAPIData.inventory = [...mockInventoryData];
        });

        describe("when the items are paginated", () => {
          beforeEach(async () => {
            currentAPIData.next = "http://next";
            currentAPIData.previous = "http://previous";
            await arrange(currentAPIData);
          });

          describe("when the 'next' button is clicked", () => {
            beforeEach(async () => {
              const nextButton = await screen.findByTestId("next");
              fireEvent.click(nextButton);
            });

            it("should call dispatch with a pagination control message", async () => {
              await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
              const apiCall = mockDispatch.mock.calls[1][0];
              propCount(apiCall, 5);
              expect(apiCall.type).toBe(ApiActions.StartList);
              expect(apiCall.func).toBe(ApiFunctions.asyncList);
              expect(apiCall.dispatch).toBeInstanceOf(Function);
              expect(apiCall.callback).toBeInstanceOf(Function);
              expect(apiCall.override).toBe(currentAPIData.next);
            });
          });

          describe("when the 'previous' button is clicked", () => {
            beforeEach(async () => {
              const previousButton = await screen.findByTestId("previous");
              fireEvent.click(previousButton);
            });

            it("should call dispatch with a pagination control message", async () => {
              await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
              const apiCall = mockDispatch.mock.calls[1][0];
              propCount(apiCall, 5);
              expect(apiCall.type).toBe(ApiActions.StartList);
              expect(apiCall.func).toBe(ApiFunctions.asyncList);
              expect(apiCall.dispatch).toBeInstanceOf(Function);
              expect(apiCall.callback).toBeInstanceOf(Function);
              expect(apiCall.override).toBe(currentAPIData.previous);
            });
          });
        });

        describe("when the items are not paginated", () => {
          beforeEach(async () => {
            currentAPIData.next = null;
            currentAPIData.previous = null;
            await arrange(currentAPIData);
          });

          it("should NOT show a 'next' button", () => {
            expect(screen.queryByTestId("next")).toBeNull();
          });

          it("should NOT show a 'previous' button", async () => {
            expect(screen.queryByTestId("previous")).toBeNull();
          });
        });

        describe("before running scenarios", () => {
          beforeEach(async () => {
            await arrange(currentAPIData);
          });

          it("should NOT display a delete button", () => {
            expect(
              screen.queryByText(itemTestIDs.ListItemDeleteButton)
            ).toBeNull();
          });

          it("should NOT display the mockPlaceHolderMessage", () => {
            expect(screen.queryByText(mockProps.placeHolderMessage)).toBeNull();
          });

          it("should NOT display the HoldingPattern spinner", () => {
            expect(screen.queryByTestId("HoldingPattern")).toBeNull();
          });

          it("should render all the item names", () => {
            for (const item of currentAPIData.inventory) {
              expect(screen.getByText(item.name)).toBeTruthy();
            }
          });
        });

        describe("add item scenario", () => {
          scenarioAddItem();
        });

        describe("delete item scenario", () => {
          scenarioDeleteItem();
        });

        describe("clicking on an item routes scenario", () => {
          scenarioRouteToItem();
        });
      });

      describe("simulated error scenarios", () => {
        describe("duplicate item scenario", () => {
          beforeEach(async () => {
            await arrange(currentAPIData);
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
            const manualDispatch = mockDispatch.mock.calls[0][0].dispatch;
            act(() => manualDispatch({ type: ApiActions.DuplicateObject }));
          });

          it("should flash the duplicate error message", async () => {
            await flashErrorMessage(
              Strings.ItemDetails.ValidationAlreadyExists
            );
          });
        });

        describe("delete of dependent item attempted", () => {
          beforeEach(async () => {
            await arrange(currentAPIData);
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
            const manualDispatch = mockDispatch.mock.calls[0][0].dispatch;
            act(() => manualDispatch({ type: ApiActions.RequiredObject }));
          });

          it("should flash the duplicate error message", async () => {
            await flashErrorMessage(Strings.ItemDetails.ResourceIsRequired);
          });
        });
      });
    });

    describe("when there is an API failure", () => {
      beforeEach(async () => {
        currentAPIData.fail = true;
        await arrange(currentAPIData);
      });

      it("should display the error message", async () => {
        for (const message of Strings.InlineList.ApiCommunicationError.split(
          "\n"
        )) {
          expect(await screen.findByText(message)).toBeTruthy();
        }
      });

      describe("clicking on the reset button", () => {
        beforeEach(() => {
          const clearErrorsButton = screen.getByTestId("ErrorConfirmation");
          fireEvent.click(clearErrorsButton);
        });

        it("should dispatch to clear state", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          const apiCall = mockDispatch.mock.calls[1][0];
          propCount(apiCall, 1);
          expect(apiCall.type).toBe(ApiActions.ClearErrors);
        });
      });
    });
  });

  describe("when there is a transaction", () => {
    beforeEach(() => (currentAPIData.transaction = true));

    describe("when there are items in the list", () => {
      beforeEach(() => {
        currentAPIData.inventory = [...mockInventoryData];
      });

      describe("when the items are paginated", () => {
        beforeEach(async () => {
          currentAPIData.next = "http://next";
          currentAPIData.previous = "http://previous";
          await arrange(currentAPIData);
        });

        it("should NOT show a 'next' button", () => {
          expect(screen.queryByTestId("next")).toBeNull();
        });

        it("should NOT show a 'previous' button", async () => {
          expect(screen.queryByTestId("previous")).toBeNull();
        });
      });

      describe("before running scenarios", () => {
        beforeEach(async () => {
          await arrange(currentAPIData);
        });

        it("should NOT display the HoldingPattern spinner", () => {
          expect(screen.queryByTestId("HoldingPattern")).toBeNull();
        });
      });

      describe("clicking on an item does NOT route scenario", () => {
        scenarioRouteToItemDisabled();
      });

      describe("delete button disabled scenario", () => {
        scenarioDeleteItemDisabled();
      });

      describe("header add button disabled scenario", () => {
        scenarioAddItemDisabled();
      });
    });
  });
});
