import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { FilterTag } from "../../../../configuration/backend";
import Routes from "../../../../configuration/routes";
import Strings from "../../../../configuration/strings";
import { highlight } from "../../../../configuration/theme";
import SimpleListItem, { testIDs } from "../simple-list-item.component";

jest.mock("../../../../configuration/theme", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../../../configuration/theme"),
    ui: { alertTimeout: 10 },
  };
});

jest.mock("../../../../configuration/theme");

const initialProps = {
  item: { id: 0, name: "mockItem" },
  handleDelete: jest.fn(),
  handleSave: jest.fn(),
  history: { push: jest.fn() },
  setErrorMsg: jest.fn(),
  objectClass: "shelf",
  transaction: false,
  redirectTag: "shelf",
  selected: null,
  setSelected: jest.fn(),
};

describe("SimpleList", () => {
  let currentProps;
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    currentProps = { ...initialProps };
  };

  const arrange = () => {
    const result = render(<SimpleListItem {...currentProps} />);
    container = result.container;
  };

  describe("when outside of a transaction", () => {
    beforeEach(() => {
      currentProps.transaction = false;
    });

    describe("when this is a new item", () => {
      let form;
      let button;

      beforeEach(async () => {
        currentProps.item.id = -1;
        arrange();
        form = await screen.findByTestId(testIDs.ListItemNewItemInputElement);
        button = await screen.findByTestId(testIDs.ListItemSaveButton);
      });

      it("should display the entry form with the correct props", () => {
        expect(form).toHaveFocus();
        expect(form).toHaveProperty("id", "newItem");
        expect(form).toHaveProperty("type", "text");
        expect(form).toHaveProperty("name", "newItem");
        expect(form.required).toBeTruthy();
        expect(form.readOnly).toBeFalsy();
        expect(form.defaultValue).toBe(currentProps.item.name);
      });

      it("should display a save button with correct props", () => {
        expect(button).toHaveStyle({ height: "40px" });
      });

      it("should match the snapshot on file (styles)", () => {
        expect(container).toMatchSnapshot();
      });

      describe("when the form is clicked", () => {
        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.mouseDown(form);
          fireEvent.mouseUp(form);
        });

        it("should set the new item to selected", () => {
          expect(currentProps.setSelected).toBeCalledTimes(1);
          expect(currentProps.setSelected).toBeCalledWith(-1);
        });
      });

      describe("when the form is changed", () => {
        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.change(form, {
            target: { value: "new value" },
          });
        });

        it("should clear any error message", () => {
          expect(currentProps.setErrorMsg).toBeCalledTimes(1);
          expect(currentProps.setErrorMsg).toBeCalledWith(null);
        });
      });

      describe("when the form is changed", () => {
        let testValue = "new value";

        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.change(form, {
            target: { value: testValue },
          });
        });

        it("should clear any error message", () => {
          expect(currentProps.setErrorMsg).toBeCalledTimes(1);
          expect(currentProps.setErrorMsg).toBeCalledWith(null);
        });

        describe("when the save button is clicked", () => {
          beforeEach(() => {
            expect(currentProps.handleSave).toBeCalledTimes(0);
            fireEvent.click(button);
          });

          it("should call handleSave with the form value", () => {
            expect(currentProps.handleSave).toBeCalledTimes(1);
            expect(currentProps.handleSave).toBeCalledWith(testValue);
          });
        });
      });
    });

    describe("when this is an existing item", () => {
      let item;
      let title;

      beforeEach(async () => {
        currentProps.item.id = 1;
        arrange();
        item = await screen.findByTestId(testIDs.ListItemElement);
        title = await screen.findByTestId(testIDs.ListItemTitle);
      });

      it("should display the item's text in the correct colour", () => {
        expect(item).toHaveStyle({ color: highlight });
      });

      it("should display the item's title with correct text", () => {
        expect(title.innerHTML).toBe(currentProps.item.name);
      });

      it("should NOT display the input form", () => {
        expect(
          screen.queryByTestId(testIDs.ListItemNewItemInputElement)
        ).toBeNull();
      });

      it("should NOT display the save button", () => {
        expect(screen.queryByTestId(testIDs.ListItemSaveButton)).toBeNull();
      });

      it("should match the snapshot on file (styles)", () => {
        expect(container).toMatchSnapshot();
      });

      describe("when the title is clicked", () => {
        beforeEach(() => {
          expect(currentProps.history.push).toBeCalledTimes(0);
          fireEvent.click(title);
        });

        it("should push a route", async () => {
          await waitFor(() =>
            expect(currentProps.history.push).toBeCalledTimes(1)
          );
          const params = {};
          params[FilterTag] = currentProps.item.name;
          params[currentProps.redirectTag] = currentProps.item.id;
          params.class = currentProps.objectClass;
          const url = `${Routes.items}?${new URLSearchParams(
            params
          ).toString()}`;
          expect(currentProps.history.push).toBeCalledWith(url);
        });
      });

      describe("when the item is clicked", () => {
        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.mouseDown(item);
          fireEvent.mouseUp(item);
        });

        it("should set the new item to selected", async () => {
          await waitFor(() =>
            expect(currentProps.setSelected).toBeCalledTimes(1)
          );
          expect(currentProps.setSelected).toBeCalledWith(1);
        });
      });

      describe("when the item is long clicked", () => {
        let deleteButton;

        beforeEach(async () => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.mouseDown(item);
          deleteButton = await screen.findByTestId(
            testIDs.ListItemDeleteButton
          );
        });

        it("should show the delete button with correct props", async () => {
          expect(deleteButton.innerHTML).toBe(Strings.SimpleList.DeleteButton);
        });

        describe("when the delete button is pressed", () => {
          beforeEach(() => {
            expect(currentProps.handleDelete).toBeCalledTimes(0);
            fireEvent.click(deleteButton);
          });

          it("should call the deleteHandler with the item id", () => {
            expect(currentProps.handleDelete).toBeCalledTimes(1);
            expect(currentProps.handleDelete).toBeCalledWith(
              currentProps.item.id,
              currentProps.item.name
            );
          });
        });
      });
    });
  });

  describe("when a transaction is ongoing", () => {
    beforeEach(() => {
      currentProps.transaction = true;
    });

    describe("when this is a new item", () => {
      let form;

      beforeEach(async () => {
        currentProps.item.id = -1;
        arrange();
        form = await screen.findByTestId(testIDs.ListItemNewItemInputElement);
      });

      it("should display a READONLY entry form with the correct props", () => {
        expect(form).toHaveFocus();
        expect(form).toHaveProperty("id", "newItem");
        expect(form).toHaveProperty("type", "text");
        expect(form).toHaveProperty("name", "newItem");
        expect(form.required).toBeTruthy();
        expect(form.readOnly).toBeTruthy();
        expect(form.defaultValue).toBe(currentProps.item.name);
      });

      it("should NOT display a save button", () => {
        expect(screen.queryByTestId(testIDs.ListItemSaveButton)).toBeNull();
      });

      it("should match the snapshot on file (styles)", () => {
        expect(container).toMatchSnapshot();
      });

      describe("when the form is clicked", () => {
        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.mouseDown(form);
          fireEvent.mouseUp(form);
        });

        it("should NOT set the new item to selected", () => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
        });
      });
    });

    describe("when this is an existing item", () => {
      let item;
      let title;

      beforeEach(async () => {
        currentProps.item.id = 1;
        arrange();
        item = await screen.findByTestId(testIDs.ListItemElement);
        title = await screen.findByTestId(testIDs.ListItemTitle);
      });

      it("should display the item's text in the correct colour", () => {
        expect(item).toHaveStyle({ color: highlight });
      });

      it("should display the item's title with correct text", () => {
        expect(title.innerHTML).toBe(currentProps.item.name);
      });

      it("should NOT display the input form", () => {
        expect(
          screen.queryByTestId(testIDs.ListItemNewItemInputElement)
        ).toBeNull();
      });

      it("should NOT display the save button", () => {
        expect(screen.queryByTestId(testIDs.ListItemSaveButton)).toBeNull();
      });

      it("should match the snapshot on file (styles)", () => {
        expect(container).toMatchSnapshot();
      });

      describe("when the title is clicked", () => {
        beforeEach(() => {
          expect(currentProps.history.push).toBeCalledTimes(0);
          fireEvent.click(title);
        });

        it("should NOT push a route", () => {
          expect(currentProps.history.push).toBeCalledTimes(0);
        });
      });

      describe("when the item is clicked", () => {
        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.mouseDown(item);
          fireEvent.mouseUp(item);
        });

        it("should set the new item to selected", () => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
        });
      });

      describe("when the item is long clicked", () => {
        beforeEach(() => {
          expect(currentProps.setSelected).toBeCalledTimes(0);
          fireEvent.mouseDown(item);
        });

        it("should NOT show the delete button", (done) => {
          setTimeout(() => {
            expect(
              screen.queryByTestId(testIDs.ListItemDeleteButton)
            ).toBeNull();
            done();
          }, 600);
        });
      });
    });
  });
});
