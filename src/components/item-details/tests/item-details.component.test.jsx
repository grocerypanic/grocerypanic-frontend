import React from "react";
import { render, cleanup } from "@testing-library/react";

import ItemDetails from "../item-details.component";

import { ItemsContext } from "../../../providers/api/items/items.provider";
import InitialValue from "../../../providers/api/items/items.initial";

import ApiActions from "../../../providers/api/api.actions";

import Strings from "../../../configuration/strings";

const mockDispatch = jest.fn();
const mockHandleExpiredAuth = jest.fn();

const mockItemsProvider = {
  dispatch: mockDispatch,
  Items: { ...InitialValue },
};

const props = {
  title: "mockTitle",
  headerTitle: "mockHeaderTitle",
  create: null,
  transaction: false,
  ApiObjectContext: ItemsContext,
  handleExpiredAuth: mockHandleExpiredAuth,
  helpText: Strings.Testing.GenericTranslationTestString,
};

describe("Setup Environment", () => {
  let tests = [{ transaction: false }];
  let utils;
  let currentTest;
  let thisProps;

  beforeEach(() => {
    jest.clearAllMocks();
    currentTest = tests.shift();
    thisProps = {
      ...props,
      ...currentTest,
    };
    utils = render(
      <ItemsContext.Provider value={mockItemsProvider}>
        <ItemDetails {...thisProps} />
      </ItemsContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render with the correct message components, when transaction is false", () => {
    expect(currentTest.transaction).toBeFalsy();
    expect(
      utils.getByText(Strings.Testing.GenericTranslationTestString)
    ).toBeTruthy();
  });
});
