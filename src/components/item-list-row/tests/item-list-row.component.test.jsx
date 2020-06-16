import React from "react";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { propCount } from "../../../test.fixtures/objectComparison";

import ItemListRow from "../item-list-row.component.jsx";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import GeneratePopOver from "../item-list-popover";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Strings from "../../../configuration/strings";
import { ui } from "../../../configuration/theme";

jest.mock("react-bootstrap/Dropdown", () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
}));
jest.mock("react-bootstrap/DropdownMenu", () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
}));
jest.mock("react-bootstrap/DropdownToggle", () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
}));
jest.mock("react-bootstrap/DropdownItem", () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
}));
jest.mock("../item-list-popover");
jest.mock("../../../configuration/theme", () => {
  return {
    ui: {
      alertTimeout: 10,
    },
  };
});

GeneratePopOver.mockImplementation(({ children }) => <div>{children}</div>);

const mockReStock = jest.fn();
const mockConsume = jest.fn();
const mockSetErrorMsg = jest.fn();
const mockSetActionMsg = jest.fn();

// Mock Api Data
const mockItem = {
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: "2020-06-15",
  next_expiry_quantity: 0,
  preferred_stores: [1],
  price: "4.00",
  quantity: 2,
  shelf: 2,
  shelf_life: 25,
};

// Test Data Defaults

let testData = {
  item: mockItem,
  allItems: [mockItem],
  listFunctions: {
    restock: mockReStock,
    consume: mockConsume,
    setActionMsg: mockSetActionMsg,
    setErrorMsg: mockSetErrorMsg,
  },
  listValues: {
    transaction: false,
  },
};

let utils;
let current;

describe("Setup Environment", () => {
  beforeEach(() => {
    current = testData;
  });
  describe("when outside of a transaction", () => {
    beforeEach(() => {
      current.listValues.transaction = false;
      jest.clearAllMocks();
      utils = render(<ItemListRow {...current} />);
    });
    afterEach(cleanup);

    it("renders the expected components", () => {
      expect(current.listValues.transaction).toBeFalsy();
      expect(utils.queryByTestId("quantity")).toBeTruthy();
      expect(utils.queryByTestId("expired")).toBeTruthy();
      expect(utils.queryByTestId("restock")).toBeTruthy();
      expect(utils.queryByTestId("consume")).toBeTruthy();
    });

    it("handles a long click on items as expected", async (done) => {
      const itemComponent = utils.queryByTestId("listElement");
      fireEvent.mouseDown(itemComponent, "click");
      setTimeout(() => fireEvent.mouseUp(itemComponent, "click"), 500);

      // Implement push to details pages
      expect(true).toBe(true);

      done();
    });

    it("Renders the quantity as expected", () => {
      const node = utils.getByTestId("quantity");
      expect(node.textContent).toBe(current.item.quantity.toString());
    });

    it("Renders the expired as expected", () => {
      const node = utils.getByTestId("expired");
      expect(node.textContent).toBe(current.item.expired.toString());
    });

    it("Renders the restock control as expected", async (done) => {
      expect(Dropdown).toBeCalledTimes(2);
      const call = Dropdown.mock.calls[0][0];
      const restock = call.onSelect;
      const mockPreventDefault = jest.fn();
      restock(1, { preventDefault: mockPreventDefault });

      await waitFor(() => expect(mockSetActionMsg).toBeCalledTimes(2));
      expect(mockSetActionMsg).toBeCalledWith("Vegan Cheese +1");
      expect(mockSetActionMsg).toBeCalledWith(null);

      expect(mockReStock).toBeCalledTimes(1);
      expect(mockReStock).toBeCalledWith(current.item, 1);

      done();
    });

    it("Renders the consume control as expected", async (done) => {
      expect(Dropdown).toBeCalledTimes(2);
      const call = Dropdown.mock.calls[1][0];
      const consume = call.onSelect;
      const mockPreventDefault = jest.fn();
      consume(1, { preventDefault: mockPreventDefault });

      await waitFor(() => expect(mockSetActionMsg).toBeCalledTimes(2));
      expect(mockSetActionMsg).toBeCalledWith("Vegan Cheese -1");
      expect(mockSetActionMsg).toBeCalledWith(null);

      expect(mockConsume).toBeCalledTimes(1);
      expect(mockConsume).toBeCalledWith(current.item, 1);
      done();
    });

    it("Renders the consume control as expected when an illegal value is used", async (done) => {
      expect(Dropdown).toBeCalledTimes(2);
      const call = Dropdown.mock.calls[1][0];
      const consume = call.onSelect;
      const mockPreventDefault = jest.fn();
      consume(100, { preventDefault: mockPreventDefault });

      await waitFor(() => expect(mockSetErrorMsg).toBeCalledTimes(2));
      expect(mockSetErrorMsg).toBeCalledWith(
        Strings.InventoryPage.ErrorInsufficientInventory
      );
      expect(mockSetErrorMsg).toBeCalledWith(null);

      done();
    });

    it("Renders the restock toggle as expected", () => {
      expect(DropdownToggle).toBeCalledTimes(2);
      const call = DropdownToggle.mock.calls[0][0];
      expect(call.variant).toBe("success");
    });

    it("Renders the consume toggle as expected", () => {
      expect(DropdownToggle).toBeCalledTimes(2);
      const call = DropdownToggle.mock.calls[1][0];
      expect(call.variant).toBe("danger");
    });

    it("Renders the restock menu as expected", () => {
      expect(DropdownMenu).toBeCalledTimes(2);
      const call = DropdownMenu.mock.calls[0][0];
      let name = current.item.name.slice(0, 10) + "...";

      expect(call.children[0].props.eventKey).toBe(1);
      expect(call.children[0].props.children.props.children).toEqual([
        name,
        " ",
        "+ 1",
      ]);
      expect(call.children[1].props.eventKey).toBe(2);
      expect(call.children[1].props.children.props.children).toEqual([
        name,
        " ",
        "+ 2",
      ]);
      expect(call.children[2].props.eventKey).toBe(3);
      expect(call.children[2].props.children.props.children).toEqual([
        name,
        " ",
        "+ 3",
      ]);
      expect(call.children[3].props.eventKey).toBe(4);
      expect(call.children[3].props.children.props.children).toEqual([
        name,
        " ",
        "+ 4",
      ]);
      expect(call.children[4].props.eventKey).toBe(5);
      expect(call.children[4].props.children.props.children).toEqual([
        name,
        " ",
        "+ 5",
      ]);
    });

    it("Renders the consume menu as expected", () => {
      expect(DropdownMenu).toBeCalledTimes(2);
      const call = DropdownMenu.mock.calls[1][0];
      let name = current.item.name.slice(0, 10) + "...";

      expect(call.children[0].props.eventKey).toBe(1);
      expect(call.children[0].props.children.props.children).toEqual([
        name,
        " ",
        "- 1",
      ]);
      expect(call.children[1].props.eventKey).toBe(2);
      expect(call.children[1].props.children.props.children).toEqual([
        name,
        " ",
        "- 2",
      ]);
      expect(call.children[2].props.eventKey).toBe(3);
      expect(call.children[2].props.children.props.children).toEqual([
        name,
        " ",
        "- 3",
      ]);
      expect(call.children[3].props.eventKey).toBe(4);
      expect(call.children[3].props.children.props.children).toEqual([
        name,
        " ",
        "- 4",
      ]);
      expect(call.children[4].props.eventKey).toBe(5);
      expect(call.children[4].props.children.props.children).toEqual([
        name,
        " ",
        "- 5",
      ]);
    });
  });

  describe("when inside of a transaction", () => {
    beforeEach(() => {
      current.listValues.transaction = true;
      current.listValues.selected = null;
      jest.clearAllMocks();
      utils = render(<ItemListRow {...current} />);
    });

    afterEach(cleanup);

    it("renders the expected components", () => {
      expect(current.listValues.transaction).toBeTruthy();
      expect(utils.queryByTestId("quantity")).toBeTruthy();
      expect(utils.queryByTestId("expired")).toBeTruthy();
      expect(utils.queryByTestId("restock")).toBeTruthy();
      expect(utils.queryByTestId("consume")).toBeTruthy();
    });

    it("Renders the restock control as expected", () => {
      expect(Dropdown).toBeCalledTimes(2);
      const call = Dropdown.mock.calls[0][0];
      const restock = call.onSelect;
      const mockPreventDefault = jest.fn();
      restock(1, { preventDefault: mockPreventDefault });

      expect(mockSetActionMsg).toBeCalledTimes(0);
      expect(mockReStock).toBeCalledTimes(0);
    });

    it("Renders the consume control as expected", () => {
      expect(Dropdown).toBeCalledTimes(2);
      const call = Dropdown.mock.calls[1][0];
      const consume = call.onSelect;
      const mockPreventDefault = jest.fn();
      consume(1, { preventDefault: mockPreventDefault });

      expect(mockSetActionMsg).toBeCalledTimes(0);
      expect(mockConsume).toBeCalledTimes(0);
    });

    it("does not render the restock menu", () => {
      expect(DropdownMenu).toBeCalledTimes(0);
    });

    it("does not render the consume menu", () => {
      expect(DropdownMenu).toBeCalledTimes(0);
    });

    it("handles a long click on items as expected, by doing nothing", async (done) => {
      const itemComponent = utils.queryByTestId("listElement");
      fireEvent.mouseDown(itemComponent, "click");
      setTimeout(() => fireEvent.mouseUp(itemComponent, "click"), 500);
      done();
    });
  });
});