import {
  render,
  cleanup,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import React from "react";
import { ShelfLifeConstants, Constants } from "../../../configuration/backend";
import Strings from "../../../configuration/strings";
import { propCount } from "../../../test.fixtures/objectComparison";
import Alert from "../../alert/alert.component";
import DropDown from "../../form-dropdown/form-dropdown.component";
import FormInput from "../../form-input/form-input.component";
import MultiDropDown from "../../form-multiselect/form-multiselect.component";
import Hint from "../../hint/hint.component";
import ItemDetailsForm from "../item-details-form.component";

jest.mock("../../alert/alert.component");
jest.mock("../../hint/hint.component");
jest.mock("../../form-input/form-input.component");
jest.mock("../../form-dropdown/form-dropdown.component");
jest.mock("../../form-multiselect/form-multiselect.component");

jest.mock("../../../configuration/theme", () => {
  return {
    ...jest.requireActual("../../../configuration/theme"),
    ui: {
      alertTimeout: 200,
    },
  };
});

Alert.mockImplementation(() => <div>MockAlert</div>);
Hint.mockImplementation(() => <div>MockHelp</div>);
FormInput.mockImplementation(() => <div>MockInput</div>);
DropDown.mockImplementation(() => <div>MockDropDown</div>);
MultiDropDown.mockImplementation(() => <div>MockDropDown</div>);

const mockHandleSave = jest.fn();
const mockHandleDelete = jest.fn();
const mockSetDuplicate = jest.fn();

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

const mockItem2 = {
  expired: 0,
  id: 2,
  name: "Another Item",
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
  allItems: [mockItem, mockItem2],
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
  duplicate: false,
  setDuplicate: mockSetDuplicate,
};

describe("Setup Environment, Render Tests", () => {
  let utils;
  let current;

  beforeEach(() => {
    current = { ...props };
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("called with a delete handler", () => {
    describe("outside of a transaction", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = render(<ItemDetailsForm {...current} />);
      });

      it("renders, outside of a transaction should call hint with the correct params", () => {
        expect(Hint).toHaveBeenCalledTimes(2);

        const helpCall = Hint.mock.calls[0][0];
        propCount(helpCall, 1);
        expect(helpCall.children).toBe(
          Strings.Testing.GenericTranslationTestString
        );
      });

      it("renders, form inputs as expected, after resolution change", async () => {
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

        propCount(qtyInput, 15);
        expect(qtyInput.setErrorMsg).toBeInstanceOf(Function);
        expect(qtyInput.storeState).toBe(props.item.quantity);
        expect(qtyInput.handleState).toBeInstanceOf(Function);
        expect(qtyInput.fieldName).toBe("quantity");
        expect(qtyInput.item).toBe(props.item);
        expect(qtyInput.transaction).toBe(false);
        expect(qtyInput.type).toBe("number");
        expect(qtyInput.label).toBe(Strings.ItemDetails.QuantityLabel);
        expect(qtyInput.details).toBe("");
        expect(qtyInput.labelColumn).toBe("col-1");
        expect(qtyInput.itemColumn).toBe("col-4");
        expect(qtyInput.min).toBe(Constants.minimumQuantity);
        expect(qtyInput.max).toBe(Constants.maximumQuantity);
        expect(qtyInput.step).toBe("1");
        expect(qtyInput.readOnly).toBe(true);

        propCount(priceInput, 14);
        expect(priceInput.setErrorMsg).toBeInstanceOf(Function);
        expect(priceInput.storeState).toBe(props.item.price);
        expect(priceInput.handleState).toBeInstanceOf(Function);
        expect(priceInput.fieldName).toBe("price");
        expect(priceInput.item).toBe(props.item);
        expect(priceInput.transaction).toBe(false);
        expect(priceInput.type).toBe("number");
        expect(priceInput.label).toBe(Strings.ItemDetails.PriceLabel);
        expect(priceInput.details).toBe("");
        expect(qtyInput.labelColumn).toBe("col-1");
        expect(priceInput.itemColumn).toBe("col-6");
        expect(priceInput.min).toBe(Constants.minimumPrice);
        expect(priceInput.max).toBe(Constants.maximumPrice);
        expect(priceInput.step).toBe("0.01");
      });

      it("renders, form inputs as expected", async () => {
        await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(6));

        window.innerWidth = 300;
        fireEvent(window, new Event("resize"));

        await waitFor(() => expect(FormInput).toHaveBeenCalledTimes(9));

        const nameInput = FormInput.mock.calls[6][0];
        const qtyInput = FormInput.mock.calls[7][0];
        const priceInput = FormInput.mock.calls[8][0];

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

        propCount(qtyInput, 15);
        expect(qtyInput.setErrorMsg).toBeInstanceOf(Function);
        expect(qtyInput.storeState).toBe(props.item.quantity);
        expect(qtyInput.handleState).toBeInstanceOf(Function);
        expect(qtyInput.fieldName).toBe("quantity");
        expect(qtyInput.item).toBe(props.item);
        expect(qtyInput.transaction).toBe(false);
        expect(qtyInput.type).toBe("number");
        expect(qtyInput.label).toBe(Strings.ItemDetails.QuantityLabel);
        expect(qtyInput.details).toBe("");
        expect(qtyInput.labelColumn).toBe("col-1");
        expect(qtyInput.itemColumn).toBe("col-4");
        expect(qtyInput.min).toBe(Constants.minimumQuantity);
        expect(qtyInput.max).toBe(Constants.maximumQuantity);
        expect(qtyInput.step).toBe("1");
        expect(qtyInput.readOnly).toBe(true);

        propCount(priceInput, 14);
        expect(priceInput.setErrorMsg).toBeInstanceOf(Function);
        expect(priceInput.storeState).toBe(props.item.price);
        expect(priceInput.handleState).toBeInstanceOf(Function);
        expect(priceInput.fieldName).toBe("price");
        expect(priceInput.item).toBe(props.item);
        expect(priceInput.transaction).toBe(false);
        expect(priceInput.type).toBe("number");
        expect(priceInput.label).toBe(Strings.ItemDetails.PriceLabel);
        expect(priceInput.details).toBe("");
        expect(qtyInput.labelColumn).toBe("col-1");
        expect(priceInput.itemColumn).toBe("col-5");
        expect(priceInput.min).toBe(Constants.minimumPrice);
        expect(priceInput.max).toBe(Constants.maximumPrice);
        expect(priceInput.step).toBe("0.01");
      });

      it("renders, dropdowns as expected", async () => {
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
      });

      it("renders, MultiDropDown as expected", async () => {
        await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));

        const preferredStores = MultiDropDown.mock.calls[1][0];

        propCount(preferredStores, 9);
        expect(preferredStores.setErrorMsg).toBeInstanceOf(Function);
        expect(preferredStores.storeState).toStrictEqual([mockStore1]);
        expect(preferredStores.handleState).toBeInstanceOf(Function);
        expect(preferredStores.fieldName).toBe("preferred_stores");
        expect(preferredStores.transaction).toBe(false);
        expect(preferredStores.details).toBe(
          Strings.ItemDetails.PreferredLocationDetails
        );
        expect(preferredStores.labelColumn).toBe("");
        expect(preferredStores.itemColumn).toBe("col-12");
        expect(preferredStores.options).toStrictEqual([mockStore1, mockStore2]);
      });

      it("calculates the options for shelf_life correctly", async () => {
        await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
        let shelfLife = DropDown.mock.calls[2][0];

        expect(shelfLife.options).toStrictEqual([
          ...ShelfLifeConstants,
          { id: mockItem.shelf_life, name: `${mockItem.shelf_life} Days` },
        ]);
      });
    });

    describe("outside of a transaction, standard shelf_life", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        const updatedItem = { ...mockItem, shelf_life: 1095 };
        const updatedCurrent = { ...current, item: updatedItem };
        utils = render(<ItemDetailsForm {...updatedCurrent} />);
      });

      it("calculates the options for shelf_life correctly", async () => {
        await waitFor(() => expect(DropDown).toHaveBeenCalledTimes(4));
        let shelfLife = DropDown.mock.calls[2][0];
        expect(shelfLife.options).toStrictEqual([...ShelfLifeConstants]);
      });
    });
  });

  describe("called without a delete handler", () => {
    beforeEach(() => {
      const updatedProps = { ...current };
      delete updatedProps.handleDelete;
      jest.clearAllMocks();
      utils = render(<ItemDetailsForm {...updatedProps} />);
    });

    it("does not render the delete button", async () => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      expect(utils.queryByTestId("delete")).toBeFalsy();
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

  describe("outside of a transaction", () => {
    describe("with valid user data", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = render(<ItemDetailsForm {...current} />);
      });

      it("saves the default item as expected", async () => {
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
      });

      it("saves a modified name as expected", async () => {
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
      });

      it("saves a modified quantity as expected", async () => {
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
      });

      it("saves a modified price as expected", async () => {
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
      });

      it("saves a modified shelflife as expected", async () => {
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
      });

      it("saves a modified shelf as expected", async () => {
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
      });

      it("saves a modified preferred store as expected", async () => {
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
      });

      it("handles delete as expected", async () => {
        await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
        Alert.mockClear();
        const button = utils.getByTestId("delete");
        fireEvent.click(button, "click");
        await waitFor(() => expect(mockHandleDelete).toBeCalledTimes(1));
        await waitFor(() => expect(Alert).toBeCalledTimes(1));
        expect(Alert.mock.calls[0][0]).toStrictEqual({
          message: Strings.ItemDetails.DeleteAction,
        });
      });
    });

    describe("with invalid user data", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = render(<ItemDetailsForm {...current} />);
      });

      afterEach(cleanup);

      it("does not save an invalid shelflife, will revert to the original value", async () => {
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
      });

      it("renders an error if the preferred_store is not selected", async () => {
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
        await waitFor(() =>
          expect(utils.getByText(current.title)).toBeTruthy()
        );
        expect(mockHandleSave).toBeCalledTimes(0);
      });
    });

    describe("when a duplicate item has been created", () => {
      beforeEach(() => {
        current.duplicate = true;
        jest.clearAllMocks();
        utils = render(<ItemDetailsForm {...current} />);
      });

      it("renders an error message, and then hides it", async () => {
        await waitFor(() => expect(mockSetDuplicate).toBeCalledTimes(1));

        await waitFor(() =>
          expect(
            utils.getByText(Strings.ItemDetails.ValidationAlreadyExists)
          ).toBeTruthy()
        );
        await waitFor(() =>
          expect(utils.getByText(current.title)).toBeTruthy()
        );

        expect(mockSetDuplicate).toBeCalledTimes(1);
        expect(mockSetDuplicate).toBeCalledWith(false);
      });
    });
  });

  describe("during a transaction", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      const updatedProps = { ...current, transaction: true };
      utils = render(<ItemDetailsForm {...updatedProps} />);
    });

    afterEach(cleanup);

    it("handles delete as expected, by doing nothing", async () => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      Alert.mockClear();
      const button = utils.getByTestId("delete");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleDelete).toBeCalledTimes(0));
      await waitFor(() => expect(Alert).toBeCalledTimes(0));
    });

    it("handles save as expected, by doing nothing", async () => {
      await waitFor(() => expect(MultiDropDown).toHaveBeenCalledTimes(2));
      Alert.mockClear();
      const button = utils.getByTestId("submit");
      fireEvent.click(button, "click");
      await waitFor(() => expect(mockHandleSave).toBeCalledTimes(0));
      await waitFor(() => expect(Alert).toBeCalledTimes(0));
    });
  });
});
