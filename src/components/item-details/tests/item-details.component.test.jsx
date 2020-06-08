import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import ItemDetails from "../item-details.component";
import Header from "../../header/header.component";
import Help from "../../simple-list-help/simple-list-help.component";

import { ItemContext } from "../../../providers/api/item/item.provider";
import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../../providers/api/store/store.provider";

import InitialValue from "../../../providers/api/item/item.initial";
import ShelfInitialValue from "../../../providers/api/shelf/shelf.initial";
import StoreInitialValue from "../../../providers/api/store/store.initial";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";

import Strings from "../../../configuration/strings";

jest.mock("../../header/header.component");
jest.mock("../../simple-list-help/simple-list-help.component");

Header.mockImplementation(() => <div>MockHeader</div>);
Help.mockImplementation(() => <div>MockHelp</div>);

const mockItemDispatch = jest.fn();
const mockStoreDispatch = jest.fn();
const mockShelfDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();

const mockItemsProvider = {
  dispatch: mockItemDispatch,
  apiObject: { ...InitialValue },
};

const mockStoreProvider = {
  dispatch: mockStoreDispatch,
  apiObject: { ...StoreInitialValue },
};

const mockShelfProvider = {
  dispatch: mockShelfDispatch,
  apiObject: { ...ShelfInitialValue },
};

const props = {
  itemId: "1",
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  handleExpiredAuth: mockHandleExpiredAuth,
  helpText: Strings.Testing.GenericTranslationTestString,
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
              value={{ ...mockItemsProvider, transaction: false }}
            >
              <ItemDetails {...current} />
            </ItemContext.Provider>
          </ShelfContext.Provider>
        </StoreContext.Provider>
      );
    });

    it("renders, outside of a transaction should call header with the correct params", () => {
      expect(Header).toHaveBeenCalledTimes(3); // Three Renders for 3 Contexts

      const headerCall = Header.mock.calls[0][0];
      propCount(headerCall, 2);
      expect(headerCall.title).toBe(props.headerTitle);
      expect(headerCall.transaction).toBe(false);
    });

    it("renders, outside of a transaction should call help with the correct params", () => {
      expect(Help).toHaveBeenCalledTimes(3); // Three Renders for 3 Contexts

      const helpCall = Help.mock.calls[0][0];
      propCount(helpCall, 1);
      expect(helpCall.children).toBe(
        Strings.Testing.GenericTranslationTestString
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
  });
});
