import { waitFor } from "@testing-library/react";
import StoreReducer from "../store.reducer";
import ApiActions from "../../api.actions";
import ApiFunctions from "../../api.functions";
import { asyncAdd, asyncDel, asyncList } from "../store.async";

import InitialState from "../store.initial";

jest.mock("../store.async");

// TODO: remove the placeholder data used for development
InitialState.inventory = [];

describe("Check The Store Reducer Implements all API Actions correctly", () => {
  it("should have the expected default values", () => {
    const received = StoreReducer(InitialState, { type: "NoAction" });
    expect(received).toBe(InitialState);
  });

  it("handles StartAdd correctly", async (done) => {
    const ExpectedState = {
      ...InitialState,
      transaction: true,
    };
    const mockPayload = { mock: "data" };
    const action = {
      type: ApiActions.StartAdd,
      func: ApiFunctions.asyncAdd,
      payload: mockPayload,
    };
    const received = StoreReducer(InitialState, action);
    expect(received).toEqual(ExpectedState);

    await waitFor(() => expect(asyncAdd).toHaveBeenCalledTimes(1));
    expect(asyncAdd.mock.calls[0]).toEqual([
      {
        state: ExpectedState,
        action,
      },
    ]);
    done();
  });

  it("handles StartDel correctly", async (done) => {
    const mockPayload = [{ id: 0, name: "MyTestStore" }];
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
    };
    const received = StoreReducer(stateWithPayload, action);
    expect(received).toEqual(ExpectedState);
    await waitFor(() => expect(asyncDel).toHaveBeenCalledTimes(1));
    expect(asyncDel.mock.calls[0]).toEqual([
      {
        state: ExpectedState,
        action,
      },
    ]);
    done();
  });

  it("handles StartList correctly", async (done) => {
    const ExpectedState = {
      ...InitialState,
      transaction: true,
    };
    const mockPayload = { mock: "data" };
    const action = {
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      payload: mockPayload,
    };
    const received = StoreReducer(InitialState, action);
    expect(received).toEqual(ExpectedState);

    await waitFor(() => expect(asyncList).toHaveBeenCalledTimes(1));
    expect(asyncList.mock.calls[0]).toEqual([
      {
        state: ExpectedState,
        action,
      },
    ]);
    done();
  });

  it("handles SuccessAdd correctly", () => {
    const payload = {
      inventory: [
        {
          id: 0,
          name: "MyTestStore",
        },
      ],
    };
    const received = StoreReducer(InitialState, {
      type: ApiActions.SuccessAdd,
      payload,
    });
    expect(received.errorMessage).toBeNull();
    expect(received.inventory).toEqual(payload.inventory);
    expect(received.error).toBe(false);
    expect(received.transaction).toBe(false);
  });

  it("handles SuccessDel correctly", () => {
    const payload = {
      inventory: [
        {
          id: 0,
          name: "MyTestStore",
        },
      ],
    };
    const received = StoreReducer(InitialState, {
      type: ApiActions.SuccessDel,
      payload,
    });
    expect(received.errorMessage).toBeNull();
    expect(received.inventory).toEqual(payload.inventory);
    expect(received.error).toBe(false);
    expect(received.transaction).toBe(false);
  });

  it("handles SuccessList correctly", () => {
    const payload = {
      inventory: [
        {
          id: 0,
          name: "MyTestStore",
        },
      ],
    };
    const received = StoreReducer(InitialState, {
      type: ApiActions.SuccessList,
      payload,
    });
    expect(received.errorMessage).toBeNull();
    expect(received.inventory).toEqual(payload.inventory);
    expect(received.error).toBe(false);
    expect(received.transaction).toBe(false);
  });

  it("handles FailureAdd correctly", () => {
    const payload = {
      errorMessage: "Could Not Add The Store.",
    };
    const received = StoreReducer(InitialState, {
      type: ApiActions.FailureAdd,
      payload,
    });
    expect(received.errorMessage).toBe("Could Not Add The Store.");
    expect(received.inventory).toEqual([]);
    expect(received.error).toBe(true);
    expect(received.transaction).toBe(false);
  });

  it("handles FailureDel correctly", () => {
    const payload = {
      errorMessage: "Could Not Add The Store.",
    };
    const received = StoreReducer(InitialState, {
      type: ApiActions.FailureDel,
      payload,
    });
    expect(received.errorMessage).toBe("Could Not Add The Store.");
    expect(received.inventory).toEqual([]);
    expect(received.error).toBe(true);
    expect(received.transaction).toBe(false);
  });

  it("handles FailureList correctly", () => {
    const payload = {
      errorMessage: "Could Not Add The Store.",
    };
    const received = StoreReducer(InitialState, {
      type: ApiActions.FailureList,
      payload,
    });
    expect(received.errorMessage).toBe("Could Not Add The Store.");
    expect(received.inventory).toEqual([]);
    expect(received.error).toBe(true);
    expect(received.transaction).toBe(false);
  });

  it("handles ClearErrors correctly", () => {
    const state = {
      ...InitialState,
      error: true,
      errorMessage: "Error",
    };
    const received = StoreReducer(state, {
      type: ApiActions.ClearErrors,
    });
    expect(received.error).toBe(false);
    expect(received.errorMessage).toBe(null);
  });

  it("handles FailureAuth correctly", () => {
    const state = {
      ...InitialState,
      error: true,
      errorMessage: "Error",
      transacton: true,
    };
    const received = StoreReducer(state, {
      type: ApiActions.FailureAuth,
    });
    expect(received.error).toBe(false);
    expect(received.errorMessage).toBe(null);
    expect(received.transaction).toBe(false);
  });
});