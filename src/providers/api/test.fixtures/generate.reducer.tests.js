import { waitFor } from "@testing-library/react";

import ApiActions from "../api.actions";
import ApiFunctions from "../api.functions";

import { propCount } from "../../../test.fixtures/objectComparison";

export const ReducerTest = (
  classType,
  testReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
) => {
  const mockObject = { id: 0, name: "MockObject" };
  const mockErrorMessage = "Could not process this object.";
  const mockCallBack = jest.fn();

  describe("Check The Reducer Implements all API Actions correctly", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should perform a no-op on unrecognized actions", () => {
      const received = testReducer(InitialState, { type: "NoAction" });
      expect(received).toBe(InitialState);
    });

    it("handles StartAdd correctly", async (done) => {
      const ExpectedState = {
        ...InitialState,
        transaction: true,
      };
      const mockPayload = { ...mockObject };
      const action = {
        type: ApiActions.StartAdd,
        func: ApiFunctions.asyncAdd,
        payload: mockPayload,
      };
      const received = testReducer(InitialState, action);
      propCount(received, Object.keys(InitialState).length);
      expect(received).toEqual(ExpectedState);
      expect(received.class).toBe(classType);

      await waitFor(() => expect(asyncAdd).toHaveBeenCalledTimes(1));
      expect(asyncAdd.mock.calls[0]).toEqual([
        {
          state: ExpectedState,
          action,
        },
      ]);
      expect(mockCallBack).toBeCalledTimes(0);
      done();
    });

    it("handles StartDel correctly", async (done) => {
      const mockPayload = [{ ...mockObject }];
      const stateWithPayload = {
        ...InitialState,
        inventory: mockPayload,
      };
      const ExpectedState = {
        ...stateWithPayload,
        transaction: true,
      };
      const action = {
        type: ApiActions.StartDel,
        func: ApiFunctions.asyncDel,
        payload: mockPayload,
        callback: mockCallBack,
      };
      const received = testReducer(stateWithPayload, action);
      propCount(received, Object.keys(InitialState).length);
      expect(received).toEqual(ExpectedState);
      expect(received.class).toBe(classType);
      await waitFor(() => expect(asyncDel).toHaveBeenCalledTimes(1));
      expect(asyncDel.mock.calls[0]).toEqual([
        {
          state: ExpectedState,
          action,
        },
      ]);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
      done();
    });

    it("handles StartGet correctly", async (done) => {
      const ExpectedState = {
        ...InitialState,
        transaction: true,
      };
      const mockPayload = { ...mockObject };
      const action = {
        type: ApiActions.StartGet,
        func: ApiFunctions.asyncGet,
        payload: mockPayload,
        callback: mockCallBack,
      };
      const received = testReducer(InitialState, action);
      propCount(received, Object.keys(InitialState).length);
      expect(received).toEqual(ExpectedState);
      expect(received.class).toBe(classType);
      await waitFor(() => expect(asyncGet).toHaveBeenCalledTimes(1));
      expect(asyncGet.mock.calls[0]).toEqual([
        {
          state: ExpectedState,
          action,
        },
      ]);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
      done();
    });

    it("handles StartList correctly", async (done) => {
      const ExpectedState = {
        ...InitialState,
        transaction: true,
      };
      const mockPayload = { ...mockObject };
      const action = {
        type: ApiActions.StartList,
        func: ApiFunctions.asyncList,
        payload: mockPayload,
        callback: mockCallBack,
      };
      const received = testReducer(InitialState, action);
      propCount(received, Object.keys(InitialState).length);
      expect(received).toEqual(ExpectedState);
      expect(received.class).toBe(classType);
      await waitFor(() => expect(asyncList).toHaveBeenCalledTimes(1));
      expect(asyncList.mock.calls[0]).toEqual([
        {
          state: ExpectedState,
          action,
        },
      ]);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
      done();
    });

    it("handles StartUpdate correctly", async (done) => {
      const ExpectedState = {
        ...InitialState,
        transaction: true,
      };
      const mockPayload = { ...mockObject };
      const action = {
        type: ApiActions.StartUpdate,
        func: ApiFunctions.asyncUpdate,
        payload: mockPayload,
        callback: mockCallBack,
      };
      const received = testReducer(InitialState, action);
      propCount(received, Object.keys(InitialState).length);
      expect(received).toEqual(ExpectedState);
      expect(received.class).toBe(classType);
      await waitFor(() => expect(asyncUpdate).toHaveBeenCalledTimes(1));
      expect(asyncUpdate.mock.calls[0]).toEqual([
        {
          state: ExpectedState,
          action,
        },
      ]);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
      done();
    });

    it("handles SuccessAdd correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
      };
      const received = testReducer(InitialState, {
        type: ApiActions.SuccessAdd,
        payload,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.fail).toBe(false);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledTimes(0);
    });

    it("handles SuccessDel correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
      };
      const received = testReducer(InitialState, {
        type: ApiActions.SuccessDel,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.fail).toBe(false);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: true, complete: true });
    });

    it("handles SuccessGet correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
      };
      const received = testReducer(InitialState, {
        type: ApiActions.SuccessGet,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.fail).toBe(false);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: true, complete: true });
    });

    it("handles SuccessList correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
        next: "next",
        previous: "previous",
      };
      const received = testReducer(InitialState, {
        type: ApiActions.SuccessList,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.next).toEqual(payload.next);
      expect(received.previous).toEqual(payload.previous);
      expect(received.fail).toBe(false);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: true, complete: true });
    });

    it("handles SuccessUpdate correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
      };
      const received = testReducer(InitialState, {
        type: ApiActions.SuccessUpdate,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.fail).toBe(false);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: true, complete: true });
    });

    it("handles FailureAdd correctly", () => {
      const payload = {
        errorMessage: mockErrorMessage,
      };
      const received = testReducer(InitialState, {
        type: ApiActions.FailureAdd,
        payload,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBe(mockErrorMessage);
      expect(received.inventory).toEqual([]);
      expect(received.fail).toBe(true);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledTimes(0);
    });

    it("handles FailureDel correctly", () => {
      const payload = {
        errorMessage: mockErrorMessage,
      };
      const received = testReducer(InitialState, {
        type: ApiActions.FailureDel,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBe(mockErrorMessage);
      expect(received.inventory).toEqual([]);
      expect(received.fail).toBe(true);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: true });
    });

    it("handles FailureGet correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
      };
      const received = testReducer(InitialState, {
        type: ApiActions.FailureGet,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.fail).toBe(true);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: true });
    });

    it("handles FailureList correctly", () => {
      const payload = {
        errorMessage: mockErrorMessage,
      };
      const received = testReducer(InitialState, {
        type: ApiActions.FailureList,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBe(mockErrorMessage);
      expect(received.inventory).toEqual([]);
      expect(received.fail).toBe(true);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: true });
    });

    it("handles FailureUpdate correctly", () => {
      const payload = {
        inventory: [{ ...mockObject }],
      };
      const received = testReducer(InitialState, {
        type: ApiActions.FailureUpdate,
        payload,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.errorMessage).toBeNull();
      expect(received.inventory).toEqual(payload.inventory);
      expect(received.fail).toBe(true);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: true });
    });

    it("handles ClearErrors correctly", () => {
      const state = {
        ...InitialState,
        fail: true,
        errorMessage: "Error",
      };
      const received = testReducer(state, {
        type: ApiActions.ClearErrors,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.fail).toBe(false);
      expect(received.errorMessage).toBe(null);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
    });

    it("handles ClearErrors correctly, no callback", () => {
      const state = {
        ...InitialState,
        fail: true,
        errorMessage: "Error",
      };
      const received = testReducer(state, {
        type: ApiActions.ClearErrors,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.fail).toBe(false);
      expect(received.errorMessage).toBe(null);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledTimes(0);
    });

    it("handles FailureAuth correctly", () => {
      const state = {
        ...InitialState,
        fail: true,
        errorMessage: "Error",
        transaction: true,
      };
      const received = testReducer(state, {
        type: ApiActions.FailureAuth,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.fail).toBe(false);
      expect(received.errorMessage).toBe(null);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
    });

    it("handles FailureAuth correctly, no callback", () => {
      const state = {
        ...InitialState,
        fail: true,
        errorMessage: "Error",
        transaction: true,
      };
      const received = testReducer(state, {
        type: ApiActions.FailureAuth,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.fail).toBe(false);
      expect(received.errorMessage).toBe(null);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledTimes(0);
    });

    it("handles DuplicateObject correctly", () => {
      const state = {
        ...InitialState,
        fail: true,
        errorMessage: "Error",
        transaction: true,
      };
      const received = testReducer(state, {
        type: ApiActions.DuplicateObject,
        callback: mockCallBack,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.fail).toBe(false);
      expect(received.errorMessage).toBe(null);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledWith({ success: false, complete: false });
    });

    it("handles DuplicateObject correctly, no callback", () => {
      const state = {
        ...InitialState,
        fail: true,
        errorMessage: "Error",
        transaction: true,
      };
      const received = testReducer(state, {
        type: ApiActions.DuplicateObject,
      });
      propCount(received, Object.keys(InitialState).length);
      expect(received.fail).toBe(false);
      expect(received.errorMessage).toBe(null);
      expect(received.transaction).toBe(false);
      expect(received.class).toBe(classType);
      expect(mockCallBack).toBeCalledTimes(0);
    });
  });
};
