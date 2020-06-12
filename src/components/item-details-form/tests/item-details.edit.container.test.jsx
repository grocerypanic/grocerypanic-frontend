import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ItemDetails from "../item-details.form";
import ItemDetailsContainer from "../item-details.edit.container";

import { ItemContext } from "../../../providers/api/item/item.provider";
import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../../providers/api/store/store.provider";

import InitialValue from "../../../providers/api/item/item.initial";
import ShelfInitialValue from "../../../providers/api/shelf/shelf.initial";
import StoreInitialValue from "../../../providers/api/store/store.initial";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import Strings from "../../../configuration/strings";

jest.mock("../item-details.form");

ItemDetails.mockImplementation(() => <div>MockDetails</div>);

const mockItemDispatch = jest.fn();
const mockStoreDispatch = jest.fn();
const mockShelfDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();

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

const mockItemsProvider = {
  dispatch: mockItemDispatch,
  apiObject: { ...InitialValue, inventory: [mockItem] },
};

const mockStoreProvider = {
  dispatch: mockStoreDispatch,
  apiObject: { ...StoreInitialValue, inventory: [mockStore] },
};

const mockShelfProvider = {
  dispatch: mockShelfDispatch,
  apiObject: { ...ShelfInitialValue, inventory: [mockShelf] },
};

const props = {
  itemId: "1",
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  handleExpiredAuth: mockHandleExpiredAuth,
  helpText: Strings.Testing.GenericTranslationTestString,
  FormComponent: ItemDetails,
};

describe("Setup Environment", () => {
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
      utils = render(
        <StoreContext.Provider
          value={{ ...mockStoreProvider, transaction: false }}
        >
          <ShelfContext.Provider
            value={{ ...mockShelfProvider, transaction: false }}
          >
            <ItemContext.Provider
              value={{
                ...mockItemsProvider,
                transaction: false,
              }}
            >
              <ItemDetailsContainer {...current} />
            </ItemContext.Provider>
          </ShelfContext.Provider>
        </StoreContext.Provider>
      );
    });

    it("renders, calls items.StartGet on first render", async (done) => {
      await waitFor(() => expect(mockItemDispatch).toHaveBeenCalledTimes(1));
      const call = mockItemDispatch.mock.calls[0][0];
      propCount(call, 4);
      expect(call.type).toBe(ApiActions.StartGet);
      expect(call.func).toBe(ApiFunctions.asyncGet);
      expect(call.dispatch).toBeInstanceOf(Function);
      expect(call.payload).toStrictEqual({ id: props.itemId });
      done();
    });

    it("renders, calls shelves.StartList on first render", async (done) => {
      await waitFor(() => expect(mockShelfDispatch).toHaveBeenCalledTimes(1));
      const call = mockShelfDispatch.mock.calls[0][0];
      propCount(call, 3);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      done();
    });

    it("renders, calls stores.StartList on first render", async (done) => {
      await waitFor(() => expect(mockStoreDispatch).toHaveBeenCalledTimes(1));
      const call = mockStoreDispatch.mock.calls[0][0];
      propCount(call, 3);
      expect(call.type).toBe(ApiActions.StartList);
      expect(call.func).toBe(ApiFunctions.asyncList);
      expect(call.dispatch).toBeInstanceOf(Function);
      done();
    });

    it("renders ItemDetails with correct props", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(2));
      const call = ItemDetails.mock.calls[1][0];
      propCount(call, 9);
      expect(call.item).toBe(mockItem);
      expect(call.headerTitle).toBe(props.headerTitle);
      expect(call.title).toBe(props.title);
      expect(call.helpText).toBe(props.helpText);
      expect(call.transaction).toBe(false);
      expect(call.stores).toStrictEqual([mockStore]);
      expect(call.shelves).toStrictEqual([mockShelf]);
      expect(call.handleSave).toBeInstanceOf(Function);
      expect(call.handleDelete).toBeInstanceOf(Function);
      done();
    });

    it("handles a call to handleSave as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(2));

      const mockObject = {};

      const handleSave = ItemDetails.mock.calls[1][0].handleSave;
      expect(handleSave).toBeInstanceOf(Function);
      handleSave(mockObject);

      // Test Implementation of Save
      expect(true).toBe(false);

      done();
    });

    it("handles a call to handleDelete as expected", async (done) => {
      await waitFor(() => expect(ItemDetails).toHaveBeenCalledTimes(2));

      const mockObject = {};

      const handleDelete = ItemDetails.mock.calls[1][0].handleDelete;
      expect(handleDelete).toBeInstanceOf(Function);
      handleDelete(mockObject);

      // Test Implementation of Delete
      expect(true).toBe(false);

      done();
    });
  });
});
