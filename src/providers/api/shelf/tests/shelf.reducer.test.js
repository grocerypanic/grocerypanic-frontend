import ShelfReducer from "../shelf.reducer";
import ApiActions from "../../api.actions";

import InitialState from "../shelf.initial";

// TODO: remove the placeholder data used for development
InitialState.inventory = [];

describe("Check The Shelf Reducer Implements all API Actions correctly", () => {
  it("should have the expected default values", () => {
    const received = ShelfReducer(InitialState, { type: "NoAction" });
    expect(received).toBe(InitialState);
  });

  it("handles StartAdd correctly", () => {
    const mockAsync = jest.fn();
    const ExpectedState = {
      ...InitialState,
      transaction: true,
    };
    mockAsync.mockReturnValue("ReturnValue");
    const mockPayload = { mock: "data" };
    const action = {
      type: ApiActions.StartAdd,
      func: mockAsync,
      payload: mockPayload,
    };
    const received = ShelfReducer(InitialState, action);
    expect(received).toEqual(ExpectedState);
    expect(mockAsync.mock.calls.length).toBe(1);
    expect(mockAsync.mock.calls[0]).toEqual([
      {
        state: ExpectedState,
        action,
        dispatch: ShelfReducer,
      },
    ]);
  });

  it("handles StartDel correctly", () => {
    const mockPayload = [{ id: 0, name: "MyTestShelf" }];
    const stateWithPayload = {
      ...InitialState,
      inventory: mockPayload,
    };
    const ExpectedState = {
      ...stateWithPayload,
      transaction: true,
    };
    const mockAsync = jest.fn();
    mockAsync.mockReturnValue("ReturnValue");
    const action = {
      type: ApiActions.StartDel,
      func: mockAsync,
      payload: mockPayload,
    };
    const received = ShelfReducer(stateWithPayload, action);
    expect(received).toEqual(ExpectedState);
    expect(mockAsync.mock.calls.length).toBe(1);
    expect(mockAsync.mock.calls[0]).toEqual([
      {
        state: ExpectedState,
        action,
        dispatch: ShelfReducer,
      },
    ]);
  });

  it("handles SuccessAdd correctly", () => {
    const payload = {
      inventory: [
        {
          id: 0,
          name: "MyTestShelf",
        },
      ],
    };
    const received = ShelfReducer(InitialState, {
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
          name: "MyTestShelf",
        },
      ],
    };
    const received = ShelfReducer(InitialState, {
      type: ApiActions.SuccessDel,
      payload,
    });
    expect(received.errorMessage).toBeNull();
    expect(received.inventory).toEqual(payload.inventory);
    expect(received.error).toBe(false);
    expect(received.transaction).toBe(false);
  });

  it("handles FailureAdd correctly", () => {
    const payload = {
      errorMessage: "Could Not Add The Shelf.",
    };
    const received = ShelfReducer(InitialState, {
      type: ApiActions.FailureAdd,
      payload,
    });
    expect(received.errorMessage).toBe("Could Not Add The Shelf.");
    expect(received.inventory).toEqual([]);
    expect(received.error).toBe(true);
    expect(received.transaction).toBe(false);
  });

  it("handles FailureDel correctly", () => {
    const payload = {
      errorMessage: "Could Not Add The Shelf.",
    };
    const received = ShelfReducer(InitialState, {
      type: ApiActions.FailureDel,
      payload,
    });
    expect(received.errorMessage).toBe("Could Not Add The Shelf.");
    expect(received.inventory).toEqual([]);
    expect(received.error).toBe(true);
    expect(received.transaction).toBe(false);
  });
});
