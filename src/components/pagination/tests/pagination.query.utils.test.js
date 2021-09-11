import { Constants } from "../../../configuration/backend";
import {
  hasQueryString,
  hasPaginationParam,
  getQueryParams,
  getOtherQueryParams,
  rewriteUrlWithPagination,
} from "../pagination.query.utils";

let querystring1 = "http://hasquerystring.com?this=is&a=string";
let querystring2 = "http://hasnoquerystring.com";
let querystring3 =
  "http://haspaginationquerystring.com?" + Constants.pageLookupParam + "=2";
let querystring4 =
  "http://haspaginationquerystringandothers.com?" +
  Constants.pageLookupParam +
  "=2" +
  "&this=is&a=string";

describe("Setup to test hasQueryString", () => {
  it("should detect a query string as expected", () => {
    expect(hasQueryString(querystring1)).toBe(true);
  });

  it("should detect the absence query string as expected", () => {
    expect(hasQueryString(querystring2)).toBe(false);
  });

  it("should detect the edge case as positive", () => {
    expect(hasQueryString(querystring3)).toBe(true);
  });
});

describe("Setup to test hasPaginationParam", () => {
  it("should return negative on other params", () => {
    expect(hasPaginationParam(querystring1)).toBe(false);
  });

  it("should return negative on no query params", () => {
    expect(hasPaginationParam(querystring2)).toBe(false);
  });

  it("should should detect the query param", () => {
    expect(hasPaginationParam(querystring3)).toBe(true);
  });

  it("should should detect the query param amongst a mix of params", () => {
    expect(hasPaginationParam(querystring4)).toBe(true);
  });
});

describe("Setup to test getQueryParams", () => {
  it("should return an object with the toString method, that works as expected with params", () => {
    const params = getQueryParams(querystring1);
    expect(params.toString()).toBe(querystring1.split("?")[1]);
  });

  it("should return an object with the toString method, that works as expected without params", () => {
    const params = getQueryParams(querystring2);
    expect(params.toString()).toBe("");
  });
});

describe("Setup to test getOtherQueryParams", () => {
  it("should return an object with the toString method, that works as expected with other params", () => {
    const params = getOtherQueryParams(querystring1);
    expect(params.toString()).toBe(querystring1.split("?")[1]);
  });

  it("should return an object with the toString method, that works as expected without any params", () => {
    const params = getOtherQueryParams(querystring2);
    expect(params.toString()).toBe("");
  });

  it("should return an object with the toString method, that works as expected and removes the pagination query param", () => {
    const params = getOtherQueryParams(querystring3);
    expect(params.toString()).toBe("");
  });

  it("should return an object with the toString method, that works as expectedand removes the pagination query param", () => {
    const params = getOtherQueryParams(querystring4);
    expect(params.toString()).toBe(
      querystring4.replace(Constants.pageLookupParam + "=2&", "").split("?")[1]
    );
  });
});

describe("Setup to test rewriteUrlWithPagination", () => {
  const originalWindow = window.location;
  const path = "/somepath";
  beforeEach(() => {
    window.history.pushState = jest.fn();
    delete window.location;
  });
  afterAll(() => {
    delete window.location;
    window.location = originalWindow;
  });

  describe("api url has pagination param", () => {
    it("when given a window pathname without params, it should call window.history.pushState correctly", () => {
      window.location = new URL("https://myserver.com:8080" + path);
      rewriteUrlWithPagination(querystring3);
      expect(window.history.pushState).toBeCalledWith(
        null,
        "",
        path + "?" + Constants.pageLookupParam + "=2"
      );
    });
    it("when given a window pathname with params, it should call window.history.pushState correctly", () => {
      window.location = new URL(
        "https://myserver.com:8080" + path + "?extra_param1=1&extra_param2=2"
      );
      rewriteUrlWithPagination(querystring3);
      expect(window.history.pushState).toBeCalledWith(
        null,
        "",
        path +
          "?" +
          "extra_param1=1&extra_param2=2&" +
          Constants.pageLookupParam +
          "=2"
      );
    });

    it("when given a window pathname has the pagination param already, it should call window.history.pushState correctly", () => {
      window.location = new URL(
        "https://myserver.com:8080" +
          path +
          "?" +
          Constants.pageLookupParam +
          "=2"
      );
      rewriteUrlWithPagination(querystring3);
      expect(window.history.pushState).toBeCalledWith(
        null,
        "",
        path + "?" + Constants.pageLookupParam + "=2"
      );
    });
  });

  describe("api url does not have pagination param", () => {
    it("when given a window pathname without params, it should not call window.history.pushState", () => {
      window.location = new URL("https://myserver.com:8080" + path);
      rewriteUrlWithPagination(querystring2);
      expect(window.history.pushState).toBeCalledTimes(0);
    });

    it("when given a window pathname with params, it should not call window.history.pushState", () => {
      window.location = new URL(
        "https://myserver.com:8080" + path + "?extra_param1=1&extra_param2=2"
      );
      rewriteUrlWithPagination(querystring2);
      expect(window.history.pushState).toBeCalledWith(
        null,
        "",
        path + "?extra_param1=1&extra_param2=2"
      );
    });

    it("when given a window pathname has the pagination param already, it should not call window.history.pushState", () => {
      window.location = new URL(
        "https://myserver.com:8080" +
          path +
          "?" +
          Constants.pageLookupParam +
          "=2"
      );
      rewriteUrlWithPagination(querystring2);
      expect(window.history.pushState).toBeCalledWith(null, "", path);
    });
  });

  it("when given a window pathname with params, and a api url with a query string, it should call window.history.pushState correctly", () => {
    window.location = new URL(
      "https://myserver.com:8080" + path + "?extra_param1=1&extra_param2=2"
    );
    rewriteUrlWithPagination(querystring3);
    expect(window.history.pushState).toBeCalledWith(
      null,
      "",
      path +
        "?" +
        "extra_param1=1&extra_param2=2&" +
        Constants.pageLookupParam +
        "=2"
    );
  });

  it("should not call window.history.pushState, if it does not exist", () => {
    window.location = new URL("https://myserver.com:8080" + path);
    window.history.pushState = null;
    rewriteUrlWithPagination(querystring3);
  });
});
