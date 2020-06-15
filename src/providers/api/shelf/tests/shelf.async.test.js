import { waitFor } from "@testing-library/react";

import ApiActions from "../../api.actions";

import Request from "../../../../util/requests";
import initialState from "../shelf.initial";

import { Paths } from "../../../../configuration/backend";
import { asyncAdd, asyncDel, asyncList } from "../shelf.async";

jest.mock("../../../../util/requests");
const mockDispatch = jest.fn();
const mockCallBack = jest.fn();
const NewShelf = "NewShelf";

let responseCode;
let State1;
let State2;
let action;

describe("Check Each Async Function Handles Successful, and Unsuccessful API Actions", () => {
  describe("Successful API Response", () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      State1 = { ...initialState, inventory: [...initialState.inventory] };
      responseCode = 201;
      Request.mockReturnValue([NewShelf, responseCode]);
      done();
    });

    it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
      action = {
        payload: { name: NewShelf },
        dispatch: mockDispatch,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(NewShelf);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageShelves, {
        name: action.payload.name,
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
      action = {
        payload: { id: 99, name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ id: 99, name: NewShelf });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageShelves + `${action.payload.id}/`
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
      const testShelf = { id: 99, name: NewShelf };
      action = {
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(testShelf);
      Request.mockReturnValue([[testShelf], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageShelves);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessList,
        payload: {
          inventory: [testShelf],
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
      Request.mockReturnValue([NewShelf, responseCode]);
      done();
    });

    it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
      action = {
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(NewShelf);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageShelves, {
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
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ id: 99, name: NewShelf });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageShelves + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureDel,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      const testShelf = { id: 99, name: NewShelf };
      action = {
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(testShelf);
      Request.mockReturnValue([[testShelf], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageShelves);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureList,
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
      Request.mockReturnValue([NewShelf, responseCode]);
      done();
    });

    it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
      action = {
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(NewShelf);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageShelves, {
        name: action.payload.name,
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
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ id: 99, name: NewShelf });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageShelves + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      const testShelf = { id: 99, name: NewShelf };
      action = {
        payload: { name: NewShelf },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(testShelf);
      Request.mockReturnValue([[testShelf], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageShelves);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });
  });
});
