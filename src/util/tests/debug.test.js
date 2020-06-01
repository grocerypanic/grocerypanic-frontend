import debug from "../debug";

const original_environment = process.env;
//jest.spyOn(global.console, "debug");
global.console = { debug: jest.fn() };

describe("Setup for Testing debug", () => {
  afterAll(() => {
    process.env = original_environment;
  });

  it("should not print messages in production", () => {
    original_environment.NODE_ENV = "production";
    debug("Message");
    expect(console.debug).toBeCalledTimes(0);
  });

  it("should print messages when not in production", () => {
    original_environment.NODE_ENV = "not production";
    debug("Message");
    expect(console.debug).toBeCalledTimes(1);
    expect(console.debug).toBeCalledWith("Message");
  });
});
