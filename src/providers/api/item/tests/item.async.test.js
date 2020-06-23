import { waitFor } from "@testing-library/react";
import moment from "moment";

import ApiActions from "../../api.actions";
import { convertDatesToLocal } from "../../api.util.js";

import Request from "../../../../util/requests";
import initialState from "../item.initial";
import { ItemFilters, FilterTag } from "../../../../configuration/backend";

import { Paths } from "../../../../configuration/backend";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../item.async";
const NewStore = "NewStore";

jest.mock("../../../../util/requests");
const mockDispatch = jest.fn();
const mockCallBack = jest.fn();

let responseCode;
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

describe("Check Each Async Function Handles Successful, and Unsuccessful API Actions", () => {
  describe("Successful API Response", () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      State1 = { ...initialState, inventory: [...initialState.inventory] };
      done();
    });

    it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
      Request.mockReturnValue([mockItem2, 201]);

      action = {
        payload: { ...mockItem2 },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ ...mockItem2 });

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageItems, {
        ...mockItem2,
      });
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: State2.inventory,
        },
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
      Request.mockReturnValue([null, 204]);

      action = {
        payload: { id: mockItem2.id },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ ...mockItem2 });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageItems + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessDel,
        payload: {
          inventory: State1.inventory,
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      Request.mockReturnValue([[mockItem1, mockItem2], 200]);

      action = {
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      // Enforces Sort Order
      State2.inventory.push({ ...mockItem2 });
      State2.inventory.push({ ...mockItem1 });

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageItems);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessList,
        payload: {
          inventory: State2.inventory,
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called, filter test 1", async (done) => {
      Request.mockReturnValue([[mockItem1, mockItem2], 200]);
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
      // Enforces Sort Order
      State2.inventory.push({ ...mockItem2 });
      State2.inventory.push({ ...mockItem1 });

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
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called, filter test 2", async (done) => {
      Request.mockReturnValue([[mockItem1, mockItem2], 200]);
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
      // Enforces Sort Order
      State2.inventory.push({ ...mockItem2 });
      State2.inventory.push({ ...mockItem1 });

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
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called, filter test 3", async (done) => {
      Request.mockReturnValue([[mockItem1, mockItem2], 200]);
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
      // Enforces Sort Order
      State2.inventory.push({ ...mockItem2 });
      State2.inventory.push({ ...mockItem1 });

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
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called, item already in state", async (done) => {
      Request.mockReturnValue([
        {
          ...mockItem1,
          name: "Server has updated name for Vegan Cheese",
        },
        200,
      ]);

      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({
        ...mockItem1,
        name: "Server has updated name for Vegan Cheese",
      });

      asyncGet({ state: State2, action });

      expect(Request).toBeCalledWith(
        "GET",
        Paths.manageItems + `${mockItem1.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));

      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: State2.inventory,
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called, item not in existing state", async (done) => {
      Request.mockReturnValue([mockItem1, 200]);

      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };

      asyncGet({ state: State2, action });

      expect(Request).toBeCalledWith(
        "GET",
        Paths.manageItems + `${mockItem1.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: [...State2.inventory, convertDatesToLocal(mockItem1)],
        },
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncUpdate is called", async (done) => {
      Request.mockReturnValue([
        {
          ...mockItem1,
          name: "Server has been updated with name for Vegan Cheese",
        },
        200,
      ]);

      action = {
        payload: {
          ...mockItem1,
          name: "Server has been updated with name for Vegan Cheese",
        },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({
        ...mockItem1,
        name: "Server has been updated with name for Vegan Cheese",
      });

      asyncUpdate({ state: State2, action });

      expect(Request).toBeCalledWith(
        "PUT",
        Paths.manageItems + `${mockItem1.id}/`,
        {
          ...mockItem1,
          name: "Server has been updated with name for Vegan Cheese",
        }
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      State2.inventory = State2.inventory.map((i) => convertDatesToLocal(i));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessUpdate,
        payload: {
          inventory: State2.inventory,
        },
        callback: mockCallBack,
      });
      done();
    });
  });

  describe("Unsuccessful API Response", () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      State1 = { ...initialState, inventory: [...initialState.inventory] };
      responseCode = 404;
      Request.mockReturnValue([NewStore, responseCode]);
      done();
    });

    it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ ...mockItem2 });

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageItems, {
        name: action.payload.name,
      });
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAdd,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ ...mockItem2 });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageItems + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureDel,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ ...mockItem2 });
      Request.mockReturnValue([[{ ...mockItem2 }], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageItems);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureList,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called", async (done) => {
      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };

      asyncGet({ state: State2, action });

      expect(Request).toBeCalledWith(
        "GET",
        Paths.manageItems + `${mockItem1.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureGet,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncUpdate is called", async (done) => {
      action = {
        payload: { ...mockItem1 },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };

      asyncUpdate({ state: State2, action });

      expect(Request).toBeCalledWith(
        "PUT",
        Paths.manageItems + `${mockItem1.id}/`,
        { ...mockItem1 }
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureUpdate,
        callback: mockCallBack,
      });
      done();
    });
  });

  describe("Authentication Error Response", () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      State1 = { ...initialState, inventory: [...initialState.inventory] };
      responseCode = 401;
      Request.mockReturnValue([NewStore, responseCode]);
      done();
    });

    it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
      action = {
        payload: { ...mockItem2 },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ ...mockItem2 });

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageItems, {
        ...mockItem2,
      });
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
      action = {
        payload: { ...mockItem2 },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ ...mockItem2 });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageItems + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      action = {
        payload: { ...mockItem2 },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ ...mockItem2 });
      Request.mockReturnValue([[{ ...mockItem2 }], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageItems);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called", async (done) => {
      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };

      asyncGet({ state: State2, action });

      expect(Request).toBeCalledWith(
        "GET",
        Paths.manageItems + `${mockItem1.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncUpdate is called", async (done) => {
      action = {
        payload: { ...mockItem1 },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };

      asyncUpdate({ state: State2, action });

      expect(Request).toBeCalledWith(
        "PUT",
        Paths.manageItems + `${mockItem1.id}/`,
        { ...mockItem1 }
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });
  });
});

describe("Check convertDatesToLocal works as expect", () => {
  it("should convert next_expiry when given a string as input", () => {
    const testDate = "2020-01-01";
    const testDateAsDate = moment.utc(testDate).unix();
    const expected = testDateAsDate + moment().utcOffset() * 60;

    const testObject = { ...mockItem1, next_expiry_date: testDate };
    const converted = convertDatesToLocal(testObject);

    expect(expected).toBe(converted.next_expiry_date.unix());
  });

  it("should return an untouched next_expiry when given a moment object as input", () => {
    const testDate = "2020-01-01";
    const testDateAsDate = moment.utc(testDate);

    const testObject = { ...mockItem1, next_expiry_date: testDateAsDate };
    const converted = convertDatesToLocal(testObject);

    expect(converted).toBe(testObject);
  });
});
