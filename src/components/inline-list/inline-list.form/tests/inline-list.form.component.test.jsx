import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ItemListForm, { testIDs } from "../inline-list.form.component";

jest.mock("../../../../configuration/theme", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../../../configuration/theme"),
    ui: { alertTimeout: 10 },
  };
});

jest.mock("../../../../configuration/theme");

const initialProps = {
  item: { id: -1, name: "mockItem" },
  handleSave: jest.fn(),
  setErrorMsg: jest.fn(),
  setSelected: jest.fn(),
  transaction: false,
};

describe("InlineList", () => {
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
    const result = render(<ItemListForm {...currentProps} />);
    container = result.container;
  };

  describe("when outside of a transaction", () => {
    let form;
    let button;

    beforeEach(async () => {
      arrange();
      form = await screen.findByTestId(testIDs.ListItemNewItemInputElement);
      button = await screen.findByTestId(testIDs.ListItemSaveButton);
    });

    it("should display the entry form with the correct props", () => {
      expect(form).toHaveFocus();
      expect(form).toHaveProperty("id", "newItem");
      expect(form).toHaveProperty("type", "text");
      expect(form).toHaveProperty("name", "newItem");
      expect(form.required).toBeFalsy();
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
        fireEvent.click(form);
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

  describe("when a transaction is ongoing", () => {
    let form;

    beforeEach(async () => {
      currentProps.transaction = true;
      arrange();
      form = await screen.findByTestId(testIDs.ListItemNewItemInputElement);
    });

    it("should display a READONLY entry form with the correct props", () => {
      expect(form).toHaveFocus();
      expect(form).toHaveProperty("id", "newItem");
      expect(form).toHaveProperty("type", "text");
      expect(form).toHaveProperty("name", "newItem");
      expect(form.required).toBeFalsy();
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
        fireEvent.click(form);
      });

      it("should NOT set the new item to selected", () => {
        expect(currentProps.setSelected).toBeCalledTimes(0);
      });
    });
  });
});
