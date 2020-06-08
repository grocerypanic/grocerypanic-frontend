import { waitFor } from "@testing-library/react";

import ApiActions from "../../api.actions";

import Request from "../../../../util/requests";
import initialState from "../item.initial";

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

let responseCode;
let State1;
let State2;
let action;

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
      State2.inventory.push(mockItem2);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageItems, {
        ...mockItem2,
      });
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
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
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(mockItem2);

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
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      Request.mockReturnValue([[mockItem1, mockItem2], 200]);

      action = {
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(mockItem1);
      State2.inventory.push(mockItem2);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageItems);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessList,
        payload: {
          inventory: State2.inventory,
        },
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
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: State2.inventory,
        },
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called, item not in existing state", async (done) => {
      Request.mockReturnValue([mockItem1, 200]);

      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
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
          inventory: [...State2.inventory, mockItem1],
        },
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
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessUpdate,
        payload: {
          inventory: State2.inventory,
        },
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
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push(NewStore);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageItems, {
        name: action.payload.name,
      });
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAdd,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ id: 99, name: NewStore });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageItems + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureDel,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      const testStore = { id: 99, name: NewStore };
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push(testStore);
      Request.mockReturnValue([[testStore], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageItems);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureList,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called", async (done) => {
      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
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
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncUpdate is called", async (done) => {
      action = {
        payload: { ...mockItem1 },
        dispatch: mockDispatch,
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
        payload: { name: NewStore },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push(NewStore);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageItems, {
        name: action.payload.name,
      });
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
      action = {
        payload: { name: NewStore, id: 20 },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push({ id: 99, name: NewStore });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageItems + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      const testStore = { id: 99, name: NewStore };
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
      };
      State2.inventory.push(testStore);
      Request.mockReturnValue([[testStore], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageItems);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncGet is called", async (done) => {
      action = {
        payload: { id: mockItem1.id },
        dispatch: mockDispatch,
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
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncUpdate is called", async (done) => {
      action = {
        payload: { ...mockItem1 },
        dispatch: mockDispatch,
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
      });
      done();
    });
  });
});
