import { waitFor } from "@testing-library/react";
import { ItemFilters, FilterTag } from "../../../../configuration/backend";
import { Constants, Paths } from "../../../../configuration/backend";
import Request from "../../../../util/requests";
import ApiActions from "../../api.actions";
import { generateConverter } from "../../generators/generate.converter";
import { asyncList } from "../item.async";
import initialState from "../item.initial";

const convertDatesToLocal = generateConverter(initialState.class);

jest.mock("../../../../util/requests");
const mockDispatch = jest.fn();
const mockCallBack = jest.fn();

// Freeze Time
Date.now = jest.fn(() => new Date("2019-06-16T11:01:58.135Z"));

let State1;
let State2;
let action;

const mockUrls = [
  `localhost?${FilterTag}=test&${ItemFilters[0]}=1`,
  `localhost?&${ItemFilters[1]}=1`,
  `localhost?&${ItemFilters[0]}=1&${ItemFilters[1]}=1`,
];

const mockItem1 = {
  id: 99,
  name: "Vegan Cheese",
  shelf: 22,
  preferred_stores: [1],
  price: "5.00",
  quantity: 1,
  shelf_life: 99,
  next_expiry: "2020-06-15",
  next_expiry_quantity: 5,
  expired: 0,
};

const mockItem2 = {
  id: 100,
  name: "Canned Beans",
  shelf: 22,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf_life: 99,
  next_expiry: "2020-06-15",
  next_expiry_quantity: 5,
  expired: 0,
};

describe("Check asyncList handles filtering results correctly", () => {
  beforeEach((done) => {
    jest.clearAllMocks();
    State1 = { ...initialState, inventory: [...initialState.inventory] };
    Request.mockReturnValue([
      { results: [mockItem1, mockItem2], next: "next", previous: "previous" },
      200,
    ]);
    done();
  });

  it("should call the API, and then dispatch correctly when asyncList is called, filter test 1", async () => {
    const filter = new URLSearchParams(mockUrls[0]);

    action = {
      dispatch: mockDispatch,
      callback: mockCallBack,
      filter: filter,
    };
    State2 = {
      ...State1,
      inventory: [...State1.inventory],
    };
    State2.inventory.push({ ...mockItem1 });
    State2.inventory.push({ ...mockItem2 });

    asyncList({ state: State2, action });

    expect(Request).toBeCalledWith(
      "GET",
      Paths.manageItems +
        "?" +
        ItemFilters[0] +
        "=" +
        filter.get(ItemFilters[0])
    );
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));
    expect(mockDispatch).toBeCalledWith({
      type: ApiActions.SuccessList,
      payload: {
        inventory: State2.inventory,
        next: "next",
        previous: "previous",
      },
      callback: mockCallBack,
    });
  });

  it("should call the API, and then dispatch correctly when asyncList is called, filter test 2", async () => {
    const filter = new URLSearchParams(mockUrls[1]);

    action = {
      dispatch: mockDispatch,
      callback: mockCallBack,
      filter: filter,
    };
    State2 = {
      ...State1,
      inventory: [...State1.inventory],
    };
    State2.inventory.push({ ...mockItem1 });
    State2.inventory.push({ ...mockItem2 });

    asyncList({ state: State2, action });

    expect(Request).toBeCalledWith(
      "GET",
      Paths.manageItems +
        "?" +
        ItemFilters[1] +
        "=" +
        filter.get(ItemFilters[1])
    );
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));
    expect(mockDispatch).toBeCalledWith({
      type: ApiActions.SuccessList,
      payload: {
        inventory: State2.inventory,
        next: "next",
        previous: "previous",
      },
      callback: mockCallBack,
    });
  });

  it("should call the API, and then dispatch correctly when asyncList is called, filter test 3", async () => {
    const filter = new URLSearchParams(mockUrls[2]);

    action = {
      dispatch: mockDispatch,
      callback: mockCallBack,
      filter: filter,
    };
    State2 = {
      ...State1,
      inventory: [...State1.inventory],
    };
    State2.inventory.push({ ...mockItem1 });
    State2.inventory.push({ ...mockItem2 });

    asyncList({ state: State2, action });

    expect(Request).toBeCalledWith(
      "GET",
      Paths.manageItems +
        "?" +
        ItemFilters[0] +
        "=" +
        filter.get(ItemFilters[0]) +
        "&" +
        ItemFilters[1] +
        "=" +
        filter.get(ItemFilters[1])
    );
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));
    expect(mockDispatch).toBeCalledWith({
      type: ApiActions.SuccessList,
      payload: {
        inventory: State2.inventory,
        next: "next",
        previous: "previous",
      },
      callback: mockCallBack,
    });
  });

  it("should call the API, and then dispatch correctly when asyncList is called, filter test 4 with page request", async () => {
    const filter = new URLSearchParams(mockUrls[2]);
    action = {
      payload: { id: mockItem1.id }, // Support Transaction Lookups
      dispatch: mockDispatch,
      callback: mockCallBack,
      filter: filter,
    };
    action[Constants.pageLookupParam] = 2; // Assign page lookup by backend constant
    State2 = {
      ...State1,
      inventory: [...State1.inventory],
    };
    State2.inventory.push({ ...mockItem1 });
    State2.inventory.push({ ...mockItem2 });

    asyncList({ state: State2, action });

    expect(Request).toBeCalledWith(
      "GET",
      Paths.manageItems +
        "?" +
        Constants.pageLookupParam +
        "=" +
        action[Constants.pageLookupParam] +
        "&" +
        ItemFilters[0] +
        "=" +
        filter.get(ItemFilters[0]) +
        "&" +
        ItemFilters[1] +
        "=" +
        filter.get(ItemFilters[1])
    );
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toBeCalledWith({
      type: ApiActions.SuccessList,
      payload: {
        inventory: State2.inventory,
        next: "next",
        previous: "previous",
      },
      callback: mockCallBack,
    });
  });
});
