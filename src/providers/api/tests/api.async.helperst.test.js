import { waitFor } from "@testing-library/react";
import { authFailure, duplicateObject } from "../api.async.helpers";
import ApiActions from "../api.actions";

const mockDispatch = jest.fn();

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("test authFailure", () => {
    it("should dispatch with the provided arguments", async (done) => {
      authFailure(mockDispatch, "mockCallback");
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: "mockCallback",
      });
      done();
    });
  });
  describe("test duplicateObject", () => {
    it("should dispatch with the provided arguments", async (done) => {
      duplicateObject(mockDispatch, "mockCallback");
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.DuplicateObject,
        callback: "mockCallback",
      });
      done();
    });
  });
});
