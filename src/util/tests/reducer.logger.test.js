import withReducer from "../reducer.logger.js";

describe("Check Logging Functionality", () => {
  const original_environment = process.env;
  let originalLogger;
  let outputData;
  let reducer;
  const storeLog = (input1, input2) => outputData.push([input1, input2]);

  beforeEach(() => {
    jest.resetModules();
    outputData = [];
    originalLogger = console["log"];
    console["log"] = jest.fn(storeLog);
    const TestReducer = (state, action) => state;
    reducer = withReducer(TestReducer);
  });

  afterEach(() => {
    console["log"] = originalLogger;
    process.env = original_environment;
  });

  it("does not log in a jest test", () => {
    process.env.NODE_ENV = "production";
    process.env.JEST_WORKER_ID = "some value";
    reducer({}, { type: "BogusAction" });
    expect(outputData.length).toBe(0);
  });

  it("logs when not in production and not testing", () => {
    process.env.NODE_ENV = "not production";
    delete process.env.JEST_WORKER_ID;
    reducer({}, { type: "BogusAction1" });
    expect(outputData.length).toBe(0);
  });

  it("the logs contain the expected output", () => {
    process.env.NODE_ENV = "not production";
    delete process.env.JEST_WORKER_ID;
    const state = {};
    const action = { type: "BogusAction2" };
    reducer(state, action);
    expect(outputData).toStrictEqual([
      [
        "** TestReducer BEFORE BogusAction2:\n",
        { action: { type: "BogusAction2" }, state: {} },
      ],
      [
        "** TestReducer AFTER BogusAction2:\n",
        { action: { type: "BogusAction2" }, state: {} },
      ],
    ]);
  });
});
