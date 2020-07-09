import { waitFor } from "@testing-library/react";
import {
  asyncDispatch,
  authFailure,
  duplicateObject,
  calculateListUrl,
} from "../api.async.helpers";
import ApiActions from "../api.actions";
import { Constants } from "../../../configuration/backend";

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
  describe("test asyncDispatch", () => {
    it("should dispatch with the provided arguments", async (done) => {
      const action = { type: "BogusAction" };
      asyncDispatch(mockDispatch, action);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith(action);
      done();
    });
  });
});

describe("Check calculateListUrl works as expect", () => {
  let action = {};
  let path = "https:/myserver/";

  describe("given an action with no override", () => {
    beforeEach(() => {
      action.override = null;
    });
    describe("given an action with a page index", () => {
      beforeEach(() => {
        action[Constants.pageLookupParam] = 22;
      });
      it("should return an url with the appropriate query string", () => {
        expect(calculateListUrl(action, path)).toBe("https:/myserver/?page=22");
      });
    });

    describe("given an action without a page index", () => {
      let action = {};
      let path = "https:/myserver/";
      it("should return an url without a query string", () => {
        expect(calculateListUrl(action, path)).toBe(path);
      });
    });
  });

  describe("given an action with no override", () => {
    beforeEach(() => {
      action.override = "https:/someotherserver/";
    });
    describe("given an action with a page index", () => {
      beforeEach(() => {
        action[Constants.pageLookupParam] = 22;
      });
      it("should return an the override url", () => {
        expect(calculateListUrl(action, path)).toBe(action.override);
      });
    });

    describe("given an action without a page index", () => {
      it("should return an the override url", () => {
        expect(calculateListUrl(action, path)).toBe(action.override);
      });
    });
  });
});
