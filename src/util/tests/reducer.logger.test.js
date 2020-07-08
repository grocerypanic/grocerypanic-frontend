import withReducer from "../reducer.logger.js";

// Freeze Time
Date.now = jest.fn(() => new Date("2019-06-16T11:01:58.135Z"));

describe("Check Logging Functionality", () => {
  const original_environment = process.env;
  let originalLogger;
  let outputData;
  let reducer;
  const storeLog = (input1, input2, input3) =>
    outputData.push([input1, input2, input3]);

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
    expect(outputData).toEqual([
      [
        "%c ** TestReducer BEFORE BogusAction2:",
        "color: blue; font-weight: bold;",
        undefined,
      ],
      ["%c   Time:", "color: red; font-weight: bold;", 1560682918.135],
      ["%c   State:", "color: green; font-weight: bold;", state],
      ["%c   Action:", "color: green; font-weight: bold;", action],
      [
        "%c ** TestReducer AFTER BogusAction2:",
        "color: blue; font-weight: bold;",
        undefined,
      ],
      ["%c   Time:", "color: red; font-weight: bold;", 1560682918.135],
      ["%c   State:", "color: green; font-weight: bold;", state],
      ["%c   Action:", "color: green; font-weight: bold;", action],
    ]);
  });
});
