import withAsyncLogger from "../async.logger.js";
import { waitFor } from "@testing-library/dom";

// Freeze Performance Time
performance.now = jest.fn();

describe("Check Logging Functionality", () => {
  const original_environment = process.env;
  let originalLogger;
  let outputData;
  let asyncAction;
  const storeLog = (input1, input2, input3) =>
    outputData.push([input1, input2, input3]);

  const callBackComplete = jest.fn();
  const mockCallback = (state, action) => callBackComplete(state, action);

  const TestAsyncAction = async (state, action) => {
    setTimeout(() => {
      return new Promise((resolve) => mockCallback(state, action));
    }, 1);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    outputData = [];
    originalLogger = console["log"];
    console["log"] = jest.fn(storeLog);
    asyncAction = withAsyncLogger(TestAsyncAction);
  });

  afterEach(() => {
    console["log"] = originalLogger;
    process.env = original_environment;
  });

  it("does not log in a jest test", () => {
    process.env.NODE_ENV = "production";
    process.env.JEST_WORKER_ID = "some value";
    asyncAction({ state: {}, action: { type: "BogusAction" } });
    expect(outputData.length).toBe(0);
  });

  it("logs when not in production and not testing", () => {
    process.env.NODE_ENV = "not production";
    delete process.env.JEST_WORKER_ID;
    asyncAction({ state: {}, action: { type: "BogusAction1" } });
    expect(outputData.length).toBe(0);
  });

  it("the logs contain the expected output", async (done) => {
    process.env.NODE_ENV = "not production";
    delete process.env.JEST_WORKER_ID;
    const state = {};
    const action = { type: "BogusAction2" };
    performance.now.mockReturnValueOnce(1);
    performance.now.mockReturnValueOnce(2);
    asyncAction({ state, action });
    await waitFor(() => expect(callBackComplete).toBeCalledTimes(3));
    expect(outputData).toEqual([
      [
        "%c ** ASYNCHRONOUS -- TestAsyncAction START:",
        "color: purple; font-weight: bold;",
        undefined,
      ],
      ["%c   State:", "color: green; font-weight: bold;", state],
      ["%c   Action:", "color: green; font-weight: bold;", action],
      [
        "%c ** ASYNCHRONOUS -- TestAsyncAction END:",
        "color: purple; font-weight: bold;",
        undefined,
      ],
      ["%c   Time:", "color: red; font-weight: bold;", 0.001],
      ["%c   State:", "color: green; font-weight: bold;", state],
      ["%c   Action:", "color: green; font-weight: bold;", action],
    ]);
    done();
  });
});
