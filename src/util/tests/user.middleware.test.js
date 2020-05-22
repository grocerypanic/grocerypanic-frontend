import withMiddleware from "../user.middleware";

const callStack = [];

const mockReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const mockMiddleware = (reducer) => {
  const wrappedReducer = (state, action) => {
    callStack.push("called");
    return reducer(state, action);
  };
  return wrappedReducer;
};

describe("Given a reducer and a stack of middleware", () => {
  it("correctly encapsulates the reducer", () => {
    const mockMiddleware1 = jest.fn((i) => mockMiddleware(i));
    const mockMiddleware2 = jest.fn((i) => mockMiddleware(i));
    const mockMiddleware3 = jest.fn((i) => mockMiddleware(i));
    const middlewareStack = [mockMiddleware1, mockMiddleware2, mockMiddleware3];
    const wrappedReducer = withMiddleware(mockReducer, middlewareStack);
    expect(mockMiddleware1.mock.calls.length).toBe(1);
    expect(mockMiddleware2.mock.calls.length).toBe(1);
    expect(mockMiddleware3.mock.calls.length).toBe(1);
    expect(mockMiddleware1.mock.calls[0][0]).toBe(mockReducer);
    expect(mockMiddleware2.mock.calls[0][0].name).toBe("wrappedReducer");
    expect(mockMiddleware3.mock.calls[0][0].name).toBe("wrappedReducer");
    expect(callStack.length).toBe(0);
    wrappedReducer({}, { type: "BogusAction" });
    expect(callStack.length).toBe(3);
  });
});
