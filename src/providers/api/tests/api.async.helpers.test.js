import { waitFor } from "@testing-library/react";
import {
  asyncDispatch,
  authFailure,
  duplicateObject,
  calculateListUrl,
  retrieveResults,
} from "../api.async.helpers";
import ApiActions from "../api.actions";
import { Constants } from "../../../configuration/backend";

const mockDispatch = jest.fn();

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("test authFailure", () => {
    it("should dispatch with the provided arguments", async () => {
      authFailure(mockDispatch, "mockCallback");
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.FailureAuth,
        callback: "mockCallback",
      });
    });
  });
  describe("test duplicateObject", () => {
    it("should dispatch with the provided arguments", async () => {
      duplicateObject(mockDispatch, "mockCallback");
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith({
        type: ApiActions.DuplicateObject,
        callback: "mockCallback",
      });
    });
  });
  describe("test asyncDispatch", () => {
    it("should dispatch with the provided arguments", async () => {
      const action = { type: "BogusAction" };
      asyncDispatch(mockDispatch, action);
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toBeCalledWith(action);
    });
  });
});

describe("Check calculateListUrl works as expected", () => {
  let action;
  let path = "https:/myserver/";

  beforeEach(() => {
    action = {};
  });

  describe("given an action with no override", () => {
    beforeEach(() => {
      action.override = null;
    });
    describe("given an action with a page index", () => {
      beforeEach(() => {
        action.page = 22;
      });
      it("should return an url with the appropriate query string", () => {
        expect(calculateListUrl(action, path)).toBe(
          `https:/myserver/?${Constants.pageLookupParam}=22`
        );
      });
    });

    describe("given an action with a pagination override", () => {
      beforeEach(() => {
        action.fetchAll = "true";
      });
      it("should return an url with the appropriate query string", () => {
        expect(calculateListUrl(action, path)).toBe(
          `https:/myserver/?${Constants.pageOverrideParam}=true`
        );
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

  describe("given an action with a override", () => {
    beforeEach(() => {
      action.override = "https:/someotherserver/";
    });

    describe("given an action with a pagination override", () => {
      beforeEach(() => {
        action.fetchAll = "true";
      });
      it("should return an url with the appropriate query string", () => {
        expect(calculateListUrl(action, path)).toBe(action.override);
      });
    });

    describe("given an action with a page index", () => {
      beforeEach(() => {
        action.page = 22;
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

describe("Setup to test retrieveResults", () => {
  let response = {};

  describe("With paginated data", () => {
    beforeEach(() => {
      response = [
        { id: 1, name: "Some Stalker" },
        { id: 1, name: "Some Other Stalker" },
      ];
    });
    it("should return the data as expected", () => {
      expect(retrieveResults(response)).toBe(response);
    });
  });

  describe("With unpaginated data", () => {
    beforeEach(() => {
      response = {
        next: "next",
        previous: "previous",
        results: [
          { id: 1, name: "Some Stalker" },
          { id: 1, name: "Some Other Stalker" },
        ],
      };
    });
    it("should return the data as expected", () => {
      expect(retrieveResults(response)).toBe(response.results);
    });
  });
});
