import { waitFor } from "@testing-library/react";

import ApiActions from "../../api.actions";

import Request from "../../../../util/requests";
import initialState from "../store.initial";

import { Paths } from "../../../../configuration/backend";
import { asyncAdd, asyncDel, asyncList } from "../store.async";

jest.mock("../../../../util/requests");
const mockDispatch = jest.fn();
const mockCallBack = jest.fn();
const NewStore = "NewStore";

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
        inventory: [...State1.inventory],
      };
      State2.inventory.push(NewStore);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageStores, {
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
        payload: { id: 99, name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ id: 99, name: NewStore });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageStores + `${action.payload.id}/`
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
      const testStore = { id: 99, name: NewStore };
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(testStore);
      Request.mockReturnValue([[testStore], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageStores);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.SuccessList,
        payload: {
          inventory: [testStore],
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
        inventory: [...State1.inventory],
      };
      State2.inventory.push(NewStore);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageStores, {
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
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ id: 99, name: NewStore });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageStores + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureDel,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      const testStore = { id: 99, name: NewStore };
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(testStore);
      Request.mockReturnValue([[testStore], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageStores);
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
        inventory: [...State1.inventory],
      };
      State2.inventory.push(NewStore);

      asyncAdd({ state: State1, action });

      expect(Request).toBeCalledWith("POST", Paths.manageStores, {
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
        payload: { name: NewStore, id: 20 },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push({ id: 99, name: NewStore });

      asyncDel({ state: State2, action });

      expect(Request).toBeCalledWith(
        "DELETE",
        Paths.manageStores + `${action.payload.id}/`
      );
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });

    it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
      const testStore = { id: 99, name: NewStore };
      action = {
        payload: { name: NewStore },
        dispatch: mockDispatch,
        callback: mockCallBack,
      };
      State2 = {
        ...State1,
        inventory: [...State1.inventory],
      };
      State2.inventory.push(testStore);
      Request.mockReturnValue([[testStore], responseCode]);

      asyncList({ state: State2, action });

      expect(Request).toBeCalledWith("GET", Paths.manageStores);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      done();
    });
  });
});
