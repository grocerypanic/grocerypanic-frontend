import React from "react";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router, MemoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import SimpleListItem from "../simple-list-item.component";

import Strings from "../../../configuration/strings";
import Routes from "../../../configuration/routes";
import { FilterTag } from "../../../configuration/backend";

jest.mock("../../../configuration/theme", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../../configuration/theme"),
    ui: { alertTimeout: 10 },
  };
});

jest.mock("../../../configuration/theme");

const mockAdd = jest.fn();
const mockDelete = jest.fn();
const setSelected = jest.fn();
const setErrorMsg = jest.fn();
const setCreated = jest.fn();
const setLongPress = jest.fn();
const setActionMsg = jest.fn();

// Mock Api Data
const mockData = [
  { id: 1, name: "Shelf1" },
  { id: 2, name: "Shelf2" },
  { id: 3, name: "Shelf3" },
];

// Test Data Defaults

let test = {
  item: mockData[0],
  allItems: mockData,
  listFunctions: {
    add: mockAdd,
    del: mockDelete,
    setSelected: setSelected,
    setErrorMsg: setErrorMsg,
    setCreated: setCreated,
    setLongPress: setLongPress,
    setActionMsg: setActionMsg,
  },
  listValues: {
    transaction: false,
    selected: null,
    errorMsg: null,
    longPress: false,
  },
  redirectTag: "redirectTag",
};

let utils;
let current;
describe("Setup Environment", () => {
  beforeEach(() => {
    current = test;
  });
  describe("when not rendering a newly created item", () => {
    beforeEach(() => {
      current.item = mockData[0];
    });
    describe("when outside of a transaction", () => {
      beforeEach(() => {
        current.listValues.transaction = false;
      });
      describe("when not selected", () => {
        beforeEach(() => {
          current.listValues.selected = null;
          jest.clearAllMocks();
          utils = render(
            <MemoryRouter>
              <SimpleListItem {...current} />
            </MemoryRouter>
          );
        });
        afterEach(cleanup);

        it("renders only the expected components", () => {
          expect(current.listValues.selected).not.toBe(current.item.id);
          expect(current.listValues.transaction).toBeFalsy();
          expect(utils.queryByTestId("listElement")).toBeTruthy();
          expect(utils.queryByTestId("deleteButton")).toBeFalsy();
          expect(utils.queryByTestId("inputElement")).toBeFalsy();
          expect(utils.queryByTestId("saveButton")).toBeFalsy();
        });

        it("handles a short click on items as expected", async (done) => {
          const itemComponent = utils.queryByTestId("listElement");
          fireEvent.mouseDown(itemComponent, "click");
          fireEvent.mouseUp(itemComponent, "click");
          await waitFor(() => expect(setCreated).toBeCalledWith(false));
          expect(setSelected).toBeCalledWith(current.item.id);
          done();
        });

        it("handles a click on item names as expected (by doing nothing)", async (done) => {
          const itemComponent = utils.getByTestId("ListTitle");
          fireEvent.click(itemComponent, "click");
          done();
        });
      });

      describe("when selected, and longPress is not marked", () => {
        beforeEach(() => {
          current.listValues.selected = current.item.id;
          current.listValues.longPress = false;
          jest.clearAllMocks();
          const history = createBrowserHistory({ basename: "/" });
          utils = render(
            <Router history={history}>
              <SimpleListItem {...current} />
            </Router>
          );
        });
        afterEach(cleanup);

        it("handles a short click on items as expected", async (done) => {
          const itemComponent = utils.queryByTestId("listElement");
          fireEvent.mouseDown(itemComponent, "click");
          fireEvent.mouseUp(itemComponent, "click");
          setTimeout(() => fireEvent.mouseUp(itemComponent, "click"), 500);
          await waitFor(() => expect(setCreated).toBeCalledTimes(0));
          expect(setSelected).toBeCalledWith(current.item.id);
          done();
        });

        it("handles a long click on items as expected", async (done) => {
          const itemComponent = utils.queryByTestId("listElement");
          fireEvent.mouseDown(itemComponent, "click");
          setTimeout(() => fireEvent.mouseUp(itemComponent, "click"), 500);
          await waitFor(() => expect(setLongPress).toBeCalledTimes(1));
          done();
        });

        it("handles a click on item names as expected (navigate)", () => {
          const itemComponent = utils.getByTestId("ListTitle");
          expect(window.location.pathname).not.toBe(Routes.items);
          fireEvent.click(itemComponent, "click");
          expect(window.location.pathname).toBe(Routes.items);
          expect(window.location.search).toBe(
            `?${FilterTag}=${current.item.name}&redirectTag=${current.item.id}`
          );
        });

        it("renders only the expected components", () => {
          expect(current.listValues.selected).toBe(current.item.id);
          expect(current.listValues.transaction).toBeFalsy();
          expect(utils.queryByTestId("listElement")).toBeTruthy();
          expect(utils.queryByTestId("deleteButton")).toBeFalsy();
          expect(utils.queryByTestId("inputElement")).toBeFalsy();
          expect(utils.queryByTestId("saveButton")).toBeFalsy();
        });
      });

      describe("when selected, and longPress is marked", () => {
        beforeEach(() => {
          current.listValues.selected = current.item.id;
          current.listValues.longPress = true;
          jest.clearAllMocks();
          utils = render(
            <MemoryRouter>
              <SimpleListItem {...current} />
            </MemoryRouter>
          );
        });
        afterEach(cleanup);

        it("renders only the expected components", () => {
          expect(current.listValues.selected).toBe(current.item.id);
          expect(current.listValues.transaction).toBeFalsy();
          expect(utils.queryByTestId("listElement")).toBeTruthy();
          expect(utils.queryByTestId("deleteButton")).toBeTruthy();
          expect(utils.getByText(Strings.SimpleList.DeleteButton)).toBeTruthy();
          expect(utils.queryByTestId("inputElement")).toBeFalsy();
          expect(utils.queryByTestId("saveButton")).toBeFalsy();
        });

        it("calls handleDelete when delete is pressed", async (done) => {
          const deleteButton = utils.queryByTestId("deleteButton");
          fireEvent.click(deleteButton, "click");
          expect(setSelected).toBeCalledWith(null);
          expect(mockDelete).toBeCalledWith(current.item.id);
          await (() => expect(setActionMsg).toBeCalledTimes(2));
          expect(setActionMsg).toBeCalledWith(
            `${Strings.SimpleList.DeletedAction} ${current.item.name}`
          );
          done();
        });

        it("handles a click on item names as expected (by doing nothing)", () => {
          const itemComponent = utils.getByTestId("ListTitle");
          fireEvent.click(itemComponent, "click");
          expect(setActionMsg).toBeCalledTimes(0);
        });
      });
    });
    describe("when inside of a transaction", () => {
      beforeEach(() => {
        current.listValues.transaction = true;
      });
      describe("when not selected", () => {
        beforeEach(() => {
          current.listValues.selected = null;
          jest.clearAllMocks();
          utils = render(
            <MemoryRouter>
              <SimpleListItem {...current} />
            </MemoryRouter>
          );
        });
        afterEach(cleanup);

        it("renders only the expected components", () => {
          expect(current.listValues.selected).not.toBe(current.item.id);
          expect(current.listValues.transaction).toBeTruthy();
          expect(utils.queryByTestId("listElement")).toBeTruthy();
          expect(utils.queryByTestId("deleteButton")).toBeFalsy();
          expect(utils.queryByTestId("inputElement")).toBeFalsy();
        });

        it("handles a click on items as expected (by doing nothing)", () => {
          const itemComponent = utils.queryByTestId("listElement");
          fireEvent.click(itemComponent, "click");
          expect(setCreated).toBeCalledTimes(0);
          expect(setSelected).toBeCalledTimes(0);
        });
      });

      describe("when selected", () => {
        beforeEach(() => {
          current.listValues.selected = current.item.id;
          jest.clearAllMocks();
          utils = render(
            <MemoryRouter>
              <SimpleListItem {...current} />
            </MemoryRouter>
          );
        });
        afterEach(cleanup);

        it("handles a click on item names as expected (by doing nothing)", () => {
          const itemComponent = utils.getByTestId("ListTitle");
          fireEvent.click(itemComponent, "click");
        });

        it("renders only the expected components, without the delete button", () => {
          expect(current.listValues.selected).toBe(current.item.id);
          expect(current.listValues.transaction).toBeTruthy();
          expect(utils.queryByTestId("listElement")).toBeTruthy();
          expect(utils.queryByTestId("deleteButton")).toBeFalsy();
          expect(utils.queryByTestId("inputElement")).toBeFalsy();
        });
      });
    });
  });

  describe("when rendering a newly created item", () => {
    beforeEach(() => {
      current.item.id = -1;
      current.item.name = "";
    });
    describe("when outside of a transaction", () => {
      beforeEach(() => {
        current.listValues.transaction = false;
      });
      describe("when there is an error message", () => {
        beforeEach(() => {
          current.listValues.errorMsg = "Some Existing Error Message";
          current.listValues.selected = null;

          jest.clearAllMocks();
          utils = render(
            <MemoryRouter>
              <SimpleListItem {...current} />
            </MemoryRouter>
          );
        });
        afterEach(cleanup);

        it("renders only the expected components, including the save button", () => {
          expect(current.listValues.selected).not.toBe(current.item.id);
          expect(current.listValues.transaction).toBeFalsy();
          expect(utils.queryByTestId("listElement")).toBeTruthy();
          expect(utils.queryByTestId("deleteButton")).toBeFalsy();
          expect(utils.queryByTestId("inputElement")).toBeTruthy();
          expect(utils.queryByTestId("saveButton")).toBeTruthy();
          expect(utils.getByText(Strings.SimpleList.SaveButton)).toBeTruthy();
          expect(setErrorMsg).toBeCalledTimes(0);
        });

        it("handles input as expected", async (done) => {
          const input = utils.queryByTestId("inputElement");
          await userEvent.type(input, "Hello, World!");
          expect(setErrorMsg).toBeCalledWith(null);
          done();
        });
      });
      describe("when there is no error message", () => {
        beforeEach(() => {
          current.listValues.errorMsg = "";
          current.listValues.selected = null;

          jest.clearAllMocks();
          utils = render(
            <MemoryRouter>
              <SimpleListItem {...current} />
            </MemoryRouter>
          );
        });
        afterEach(cleanup);

        it("handles input as expected", async (done) => {
          const input = utils.queryByTestId("inputElement");
          await userEvent.type(input, "Hello, World!");
          expect(setErrorMsg).toBeCalledTimes(0);
          done();
        });

        it("handles submit without doing anything", async (done) => {
          const input = utils.queryByTestId("inputElement");
          await userEvent.type(input, "Hello, World!");
          fireEvent.submit(input);
          expect(setErrorMsg).toBeCalledTimes(0);
          await (() => expect(setActionMsg).toBeCalledTimes(0));
          done();
        });

        it("handles saveButton click as expected", async (done) => {
          const input = utils.queryByTestId("inputElement");
          const save = utils.queryByTestId("saveButton");
          await userEvent.type(input, "Hello, World!");
          fireEvent.click(save);
          expect(setErrorMsg).toBeCalledTimes(0);
          await (() => expect(setActionMsg).toBeCalledTimes(2));
          expect(setActionMsg).toBeCalledWith(
            `${Strings.SimpleList.CreatedAction} Hello, World!`
          );
          done();
        });

        it("handles submit as expected with invalid input", async (done) => {
          const input = utils.queryByTestId("inputElement");
          await userEvent.type(input, "a");
          const save = utils.queryByTestId("saveButton");
          fireEvent.click(save);
          expect(setErrorMsg).toBeCalledWith(
            Strings.SimpleList.ValidationFailure
          );
          await (() => expect(setActionMsg).toBeCalledTimes(0));
          done();
        });

        it("handles submit as expected with existing input", async (done) => {
          const input = utils.queryByTestId("inputElement");
          await userEvent.type(input, "Shelf2");
          const save = utils.queryByTestId("saveButton");
          fireEvent.click(save);
          expect(setErrorMsg).toBeCalledWith(
            Strings.SimpleList.ValidationAlreadyExists
          );
          await (() => expect(setActionMsg).toBeCalledTimes(0));
          done();
        });
      });
    });

    describe("when inside of a transaction", () => {
      beforeEach(() => {
        current.listValues.transaction = true;
        current.listValues.selected = null;
        jest.clearAllMocks();
        utils = render(
          <MemoryRouter>
            <SimpleListItem {...current} />
          </MemoryRouter>
        );
      });

      afterEach(cleanup);

      it("renders only the expected components, without the save button", () => {
        expect(current.listValues.selected).not.toBe(current.item.id);
        expect(current.listValues.transaction).toBeTruthy();
        expect(utils.queryByTestId("listElement")).toBeTruthy();
        expect(utils.queryByTestId("deleteButton")).toBeFalsy();
        expect(utils.queryByTestId("inputElement")).toBeTruthy();
        expect(utils.queryByTestId("saveButton")).toBeFalsy();
      });

      it("handles a click on items as expected (by doing nothing)", () => {
        const itemComponent = utils.queryByTestId("listElement");
        fireEvent.click(itemComponent, "click");
        expect(setCreated).toBeCalledTimes(0);
        expect(setSelected).toBeCalledTimes(0);
      });

      it("handles a long click on items as expected", async (done) => {
        const itemComponent = utils.queryByTestId("listElement");
        fireEvent.mouseDown(itemComponent, "click");
        setTimeout(() => {
          fireEvent.mouseUp(itemComponent, "click");
          expect(setLongPress).toBeCalledTimes(0);
          done();
        }, 500);
      });
    });
  });
});
