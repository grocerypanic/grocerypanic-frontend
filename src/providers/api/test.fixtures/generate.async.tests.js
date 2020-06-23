import { waitFor } from "@testing-library/react";

import ApiActions from "../api.actions";
import ApiFunctions from "../api.functions";
import { convertDatesToLocal } from "../api.util";

import Request from "../../../util/requests";
jest.mock("../../../util/requests");

export const AsyncTest = (
  apiEndpoint,
  initialState,
  asyncAdd,
  asyncDel,
  asyncList,
  implemented, // List of implemented api functions
  optionalListParams = ""
) => {
  const mockDispatch = jest.fn();
  const mockCallBack = jest.fn();

  const mockObject = {
    id: 1,
    name: "MockObject",
    next_expiry_date: "2020-01-01",
    date: "2020-01-01",
  };

  const comparisonObject = convertDatesToLocal(mockObject);

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
        Request.mockReturnValue([{ ...mockObject }, responseCode]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
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
      }

      if (implemented.includes(ApiFunctions.asyncDel)) {
        it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncDel({ state: State2, action });

          expect(Request).toBeCalledWith(
            "DELETE",
            apiEndpoint + `${action.payload.id}/`
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
      }

      if (implemented.includes(ApiFunctions.asyncList)) {
        it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([[{ ...mockObject }], responseCode]);

          asyncList({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + optionalListParams
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessList,
            payload: {
              inventory: [{ ...comparisonObject }],
            },
            callback: mockCallBack,
          });
          done();
        });
      }
    });

    describe("Unsuccessful API Response", () => {
      beforeEach((done) => {
        jest.clearAllMocks();
        State1 = { ...initialState, inventory: [...initialState.inventory] };
        responseCode = 404;
        Request.mockReturnValue([{ ...mockObject }, responseCode]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAdd,
            callback: mockCallBack,
          });
          done();
        });
      }

      if (implemented.includes(ApiFunctions.asyncDel)) {
        it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncDel({ state: State2, action });

          expect(Request).toBeCalledWith(
            "DELETE",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureDel,
            callback: mockCallBack,
          });
          done();
        });
      }

      if (implemented.includes(ApiFunctions.asyncList)) {
        it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([[{ ...mockObject }], responseCode]);

          asyncList({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + optionalListParams
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureList,
            callback: mockCallBack,
          });
          done();
        });
      }
    });

    describe("Authentication Error Response", () => {
      beforeEach((done) => {
        jest.clearAllMocks();
        State1 = { ...initialState, inventory: [...initialState.inventory] };
        responseCode = 401;
        Request.mockReturnValue([{ ...mockObject }, responseCode]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async (done) => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
          done();
        });
      }

      if (implemented.includes(ApiFunctions.asyncDel)) {
        it("should call the API, and then dispatch correctly when asyncDel is called", async (done) => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncDel({ state: State2, action });

          expect(Request).toBeCalledWith(
            "DELETE",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
          done();
        });
      }

      if (implemented.includes(ApiFunctions.asyncList)) {
        it("should call the API, and then dispatch correctly when asyncList is called", async (done) => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([[{ ...mockObject }], responseCode]);

          asyncList({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + optionalListParams
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
          done();
        });
      }
    });
  });
};
