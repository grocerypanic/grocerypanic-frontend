import React from "react";
import {
  render,
  cleanup,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import Alert from "../../alert/alert.component";
import ItemDetailsForm from "../item-details.form";
import Help from "../../simple-list-help/simple-list-help.component";

import FormInput from "../../form-input/form-input.component";
import DropDown from "../../form-dropdown/form-dropdown.component";
import MultiDropDown from "../../form-multiselect/form-multiselect.component";

import { ShelfLifeConstants, Constants } from "../../../configuration/backend";

import Strings from "../../../configuration/strings";

jest.mock("../../alert/alert.component");
jest.mock("../../simple-list-help/simple-list-help.component");
jest.mock("../../form-input/form-input.component");
jest.mock("../../form-dropdown/form-dropdown.component");
jest.mock("../../form-multiselect/form-multiselect.component");

jest.mock("../../../configuration/theme", () => {
  return {
    ui: {
      alertTimeout: 10,
    },
  };
});

Alert.mockImplementation(() => <div>MockAlert</div>);
Help.mockImplementation(() => <div>MockHelp</div>);
FormInput.mockImplementation(() => <div>MockInput</div>);
DropDown.mockImplementation(() => <div>MockDropDown</div>);
MultiDropDown.mockImplementation(() => <div>MockDropDown</div>);

const mockHandleSave = jest.fn();
const mockHandleDelete = jest.fn();

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

const mockShelf1 = {
  id: 1,
  name: "Fridge",
};

const mockShelf2 = {
  id: 2,
  name: "Pantry",
};

const mockStore1 = {
  id: 1,
  name: "No Frills",
};

const mockStore2 = {
  id: 2,
  name: "Food Basics",
};

const props = {
  item: { ...mockItem },
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  helpText: Strings.Testing.GenericTranslationTestString,
  shelves: [mockShelf1, mockShelf2],
  stores: [mockStore1, mockStore2],
  errorMsg: null,
  transaction: false,
  handleSave: mockHandleSave,
  handleDelete: mockHandleDelete,
};

describe("Setup Environment, Render Tests", () => {
  let utils;
  let current;

  beforeEach(() => {
    current = { ...props };
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("outside of a transaction", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      utils = render(<ItemDetailsForm {...current} />);
    });

    it("renders, outside of a transaction should call help with the correct params", () => {
      expect(Help).toHaveBeenCalledTimes(2);

      const helpCall = Help.mock.calls[0][0];
      propCount(helpCall, 1);
      expect(helpCall.children).toBe(
        Strings.Testing.GenericTranslationTestString
      );
    });

    it("renders, form inputs as expected", async (done) => {
      await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(6));
      const nameInput = FormInput.mock.calls[3][0];
      const qtyInput = FormInput.mock.calls[4][0];
      const priceInput = FormInput.mock.calls[5][0];

      propCount(nameInput, 12);
      expect(nameInput.setErrorMsg).toBeInstanceOf(Function);
      expect(nameInput.storeState).toBe(props.item.name);
      expect(nameInput.handleState).toBeInstanceOf(Function);
      expect(nameInput.fieldName).toBe("name");
      expect(nameInput.item).toBe(props.item);
      expect(nameInput.transaction).toBe(false);
      expect(nameInput.type).toBe("text");
      expect(nameInput.label).toBe(Strings.ItemDetails.NameLabel + ":");
      expect(nameInput.details).toBe("");
      expect(nameInput.itemColumn).toBe("col-10");
      expect(nameInput.minLength).toBe(2);
      expect(nameInput.maxLength).toBe(24);

      propCount(qtyInput, 14);
      expect(qtyInput.setErrorMsg).toBeInstanceOf(Function);
      expect(qtyInput.storeState).toBe(props.item.quantity);
      expect(qtyInput.handleState).toBeInstanceOf(Function);
      expect(qtyInput.fieldName).toBe("quantity");
      expect(qtyInput.item).toBe(props.item);
      expect(qtyInput.transaction).toBe(false);
      expect(qtyInput.type).toBe("number");
      expect(qtyInput.label).toBe(Strings.ItemDetails.QuantityLabel + ":");
      expect(qtyInput.details).toBe("");
      expect(qtyInput.itemColumn).toBe("col-10");
      expect(qtyInput.min).toBe(Constants.minimumQuanity);
      expect(qtyInput.max).toBe(Constants.maximumQuantity);
      expect(qtyInput.step).toBe("1");
      expect(qtyInput.readOnly).toBe(true);

      propCount(priceInput, 13);
      expect(priceInput.setErrorMsg).toBeInstanceOf(Function);
      expect(priceInput.storeState).toBe(props.item.price);
      expect(priceInput.handleState).toBeInstanceOf(Function);
      expect(priceInput.fieldName).toBe("price");
      expect(priceInput.item).toBe(props.item);
      expect(priceInput.transaction).toBe(false);
      expect(priceInput.type).toBe("number");
      expect(priceInput.label).toBe(Strings.ItemDetails.PriceLabel + ":");
      expect(priceInput.details).toBe("");
      expect(priceInput.itemColumn).toBe("col-10");
      expect(priceInput.min).toBe(Constants.minimumPrice);
      expect(priceInput.max).toBe(Constants.maximumPrice);
      expect(priceInput.step).toBe("0.01");

      done();
    });

    it("renders, dropdowns as expected", async (done) => {
      await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
      const shelfLife = DropDown.mock.calls[2][0];
      const shelf = DropDown.mock.calls[3][0];

      propCount(shelfLife, 9);
      expect(shelfLife.setErrorMsg).toBeInstanceOf(Function);
      expect(shelfLife.storeState).toBe("25 Days");
      expect(shelfLife.handleState).toBeInstanceOf(Function);
      expect(shelfLife.fieldName).toBe("shelf_life");
      expect(shelfLife.transaction).toBe(false);
      expect(shelfLife.details).toBe(Strings.ItemDetails.ShelfLifeDetail);
      expect(shelfLife.labelColumn).toBe("");
      expect(shelfLife.itemColumn).toBe("col-12");
      expect(shelfLife.options).toStrictEqual([
        ...ShelfLifeConstants,
        { id: 25, name: "25 Days" },
      ]);

      propCount(shelf, 9);
      expect(shelf.setErrorMsg).toBeInstanceOf(Function);
      expect(shelf.storeState).toBe(mockShelf2.name);
      expect(shelf.handleState).toBeInstanceOf(Function);
      expect(shelf.fieldName).toBe("shelf");
      expect(shelf.transaction).toBe(false);
      expect(shelf.details).toBe(Strings.ItemDetails.ShelvesDetail);
      expect(shelf.labelColumn).toBe("");
      expect(shelf.itemColumn).toBe("col-12");
      expect(shelf.options).toStrictEqual([mockShelf1, mockShelf2]);

      done();
    });

    it("renders, multidropdown as expected", async (done) => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));

      const preferredStores = MultiDropDown.mock.calls[1][0];

      propCount(preferredStores, 9);
      expect(preferredStores.setErrorMsg).toBeInstanceOf(Function);
      expect(preferredStores.storeState).toStrictEqual([mockStore1]);
      expect(preferredStores.handleState).toBeInstanceOf(Function);
      expect(preferredStores.fieldName).toBe("preferred_stores");
      expect(preferredStores.transaction).toBe(false);
      expect(preferredStores.details).toBe(
        Strings.ItemDetails.PerferredLocationDetails
      );
      expect(preferredStores.labelColumn).toBe("");
      expect(preferredStores.itemColumn).toBe("col-12");
      expect(preferredStores.options).toStrictEqual([mockStore1, mockStore2]);
      done();
    });

    it("calculates the options for shelf_life correctly", async (done) => {
      await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
      let shelfLife = DropDown.mock.calls[2][0];

      expect(shelfLife.options).toStrictEqual([
        ...ShelfLifeConstants,
        { id: mockItem.shelf_life, name: `${mockItem.shelf_life} Days` },
      ]);
      done();
    });
  });

  describe("outside of a transaction, standard shelf_life", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      const updatedItem = { ...mockItem, shelf_life: 1095 };
      const updatedCurrent = { ...current, item: updatedItem };
      utils = render(<ItemDetailsForm {...updatedCurrent} />);
    });

    it("calculates the options for shelf_life correctly", async (done) => {
      await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
      let shelfLife = DropDown.mock.calls[2][0];

      // No additional shelf_lifes since this is a standard value
      expect(shelfLife.options).toStrictEqual([...ShelfLifeConstants]);
      done();
    });
  });
});

describe("Setup Environment For Action Tests", () => {
  let utils;
  let current;

  beforeEach(() => {
    current = { ...props };
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("outside of a transaction, valid data", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      utils = render(<ItemDetailsForm {...current} />);
    });

    it("saves the default item as expected", async (done) => {
      await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(6));
      Alert.mockClear();
      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: mockItem.preferred_stores,
        shelf: mockItem.shelf,
        price: mockItem.price,
        quantity: mockItem.quantity,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("saves a modified name as expected", async (done) => {
      const modified_value = "Real Cheese";

      await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(6));
      const nameInput = FormInput.mock.calls[3][0];
      act(() => nameInput.handleState(modified_value));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: modified_value,
        preferred_stores: mockItem.preferred_stores,
        shelf: mockItem.shelf,
        price: mockItem.price,
        quantity: mockItem.quantity,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("saves a modified quantity as expected", async (done) => {
      const modified_value = 10;

      await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(6));
      const qtyInput = FormInput.mock.calls[4][0];
      act(() => qtyInput.handleState(modified_value));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: mockItem.preferred_stores,
        shelf: mockItem.shelf,
        price: mockItem.price,
        quantity: modified_value,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("saves a modified price as expected", async (done) => {
      const modified_value = "26.00";

      await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(6));
      const priceInput = FormInput.mock.calls[5][0];
      act(() => priceInput.handleState(modified_value));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: mockItem.preferred_stores,
        shelf: mockItem.shelf,
        price: modified_value,
        quantity: mockItem.quantity,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("saves a modified shelflife as expected", async (done) => {
      const modified_value = "3 Years";
      const end_value = 365 * 3;

      await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
      const shelfLife = DropDown.mock.calls[2][0];
      act(() => shelfLife.handleState(modified_value));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: mockItem.preferred_stores,
        shelf: mockItem.shelf,
        price: mockItem.price,
        quantity: mockItem.quantity,
        shelf_life: end_value,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("saves a modified shelf as expected", async (done) => {
      const modified_value = mockShelf2;

      await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
      const shelf = DropDown.mock.calls[3][0];
      act(() => shelf.handleState(modified_value.name));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: mockItem.preferred_stores,
        shelf: modified_value.id,
        price: mockItem.price,
        quantity: mockItem.quantity,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("saves a modified preferred store as expected", async (done) => {
      const modified_value = [mockStore1, mockStore2];

      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      const preferredStores = MultiDropDown.mock.calls[1][0];
      act(() => preferredStores.handleState(modified_value));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: modified_value.map((o) => o.id),
        shelf: mockItem.shelf,
        price: mockItem.price,
        quantity: mockItem.quantity,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
    });

    it("handles delete as expected", async (done) => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      Alert.mockClear();
      const button = utils.getByTestId("delete");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleDelete).toBeCalledTimes(1));
      await waitFor(() => expect(Alert).toBeCalledTimes(1));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.DeleteAction,
      });
      done();
    });
  });

  describe("outside of a transaction, invalid data", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      utils = render(<ItemDetailsForm {...current} />);
    });
    afterEach(cleanup);

    it("does not save an invalid shelflife, will revert to the original value", async (done) => {
      const modified_value = "Not A Valid ShelfLife";

      await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
      const shelfLife = DropDown.mock.calls[2][0];
      act(() => shelfLife.handleState(modified_value));
      Alert.mockClear();

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(1));
      expect(mockHandleSave).toBeCalledWith({
        id: mockItem.id,
        name: mockItem.name,
        preferred_stores: mockItem.preferred_stores,
        shelf: mockItem.shelf,
        price: mockItem.price,
        quantity: mockItem.quantity,
        shelf_life: mockItem.shelf_life,
      });
      await waitFor(() => expect(Alert).toBeCalledTimes(2));
      expect(Alert.mock.calls[0][0]).toStrictEqual({
        message: Strings.ItemDetails.SaveAction,
      });
      expect(Alert.mock.calls[1][0]).toStrictEqual({ message: null });
      done();
      done();
    });

    it("renders an error if the preferred_store is not selected", async (done) => {
      const modified_value = [];

      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      const shelf = MultiDropDown.mock.calls[1][0];
      act(() => shelf.handleState(modified_value));

      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() =>
        expect(
          utils.getByText(Strings.ItemDetails.ErrorUnselectedStore)
        ).toBeTruthy()
      );
      await waitFor(() => expect(utils.getByText(current.title)).toBeTruthy());
      expect(mockHandleSave).toBeCalledTimes(0);
      done();
    });
  });

  describe("inside of a transaction, valid data", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      const updatedProps = { ...current, transaction: true };
      utils = render(<ItemDetailsForm {...updatedProps} />);
    });
    afterEach(cleanup);

    it("handles delete as expected, by doing nothing", async (done) => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      Alert.mockClear();
      const button = utils.getByTestId("delete");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleDelete).toBeCalledTimes(0));
      await waitFor(() => expect(Alert).toBeCalledTimes(0));
      done();
    });

    it("handles save as expected, by doing nothing", async (done) => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      Alert.mockClear();
      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(0));
      await waitFor(() => expect(Alert).toBeCalledTimes(0));
      done();
    });
  });
});
