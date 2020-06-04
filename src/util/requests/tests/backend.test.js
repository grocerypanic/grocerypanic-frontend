import debug from "../../debug";

import Backend from "../backend";
import { Constants } from "../../../configuration/backend";

jest.mock("../../debug");
const mockLocalStorage = jest.spyOn(Storage.prototype, "getItem");

const mockFetch = jest.fn();

global.fetch = mockFetch;

let statusCode;
let responseData;
let contentType;
let sourceData;
let requestPath = "/somePath";

describe("test the Backend method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handle a 200 get request as expected, when content type is json", async (done) => {
    statusCode = 200;
    responseData = { data: "Valuable Data" };
    contentType = "application/json";
    mockLocalStorage.mockImplementation(() => "MockCSRFtoken");
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        headers: { get: () => contentType },
        json: () => Promise.resolve(responseData),
        status: statusCode,
      })
    );

    const [response, status] = await Backend("GET", requestPath);

    expect(mockFetch).toBeCalledWith(requestPath, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    expect(status).toBe(statusCode);
    expect(response).toBe(responseData);

    expect(debug).toBeCalledTimes(4);
    expect(debug).toBeCalledWith(
      `API GET:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
    );
    expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
    expect(debug).toBeCalledWith(`API Response Data:\n`);
    expect(debug).toBeCalledWith(responseData);

    // Safe Method for CSRF no token lookup
    expect(mockLocalStorage).toBeCalledTimes(0);

    done();
  });

  it("handle a 200 get request as expected, when content type is text", async (done) => {
    statusCode = 200;
    responseData = "Text String";
    contentType = "text/plain";
    mockLocalStorage.mockImplementation(() => "MockCSRFtoken");
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        headers: { get: () => contentType },
        text: () => Promise.resolve(responseData),
        status: statusCode,
      })
    );

    const [response, status] = await Backend("GET", requestPath);

    expect(mockFetch).toBeCalledWith(requestPath, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    expect(status).toBe(statusCode);
    expect(response).toBe(responseData);

    expect(debug).toBeCalledTimes(4);
    expect(debug).toBeCalledWith(
      `API GET:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
    );
    expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
    expect(debug).toBeCalledWith(`API Response Data:\n`);
    expect(debug).toBeCalledWith(responseData);

    // Safe Method for CSRF no token lookup
    expect(mockLocalStorage).toBeCalledTimes(0);

    done();
  });

  it("handle a 200 get request as expected, when content type is null", async (done) => {
    statusCode = 200;
    responseData = "Text String";
    contentType = null;
    mockLocalStorage.mockImplementation(() => "MockCSRFtoken");
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        headers: { get: () => contentType },
        text: () => Promise.resolve(responseData),
        status: statusCode,
      })
    );

    const [response, status] = await Backend("GET", requestPath);

    expect(mockFetch).toBeCalledWith(requestPath, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    expect(status).toBe(statusCode);
    expect(response).toBe(null);

    expect(debug).toBeCalledTimes(2);
    expect(debug).toBeCalledWith(
      `API GET:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
    );
    expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);

    // Safe Method for CSRF no token lookup
    expect(mockLocalStorage).toBeCalledTimes(0);

    done();
  });

  it("handle a 200 post request as expected", async (done) => {
    statusCode = 200;
    responseData = { data: "Valuable Data" };
    contentType = "application/json";
    sourceData = { data: "Data to Post" };
    mockLocalStorage.mockImplementation(() => "MockCSRFtoken");
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        headers: { get: () => contentType },
        json: () => Promise.resolve(responseData),
        status: statusCode,
      })
    );

    const [response, status] = await Backend("POST", requestPath, sourceData);

    expect(mockFetch).toBeCalledWith(requestPath, {
      body: JSON.stringify(sourceData),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": "MockCSRFtoken",
      },
      method: "POST",
    });

    expect(status).toBe(statusCode);
    expect(response).toBe(responseData);

    expect(debug).toBeCalledTimes(5);
    expect(debug).toBeCalledWith(
      `API POST:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
    );
    expect(debug).toBeCalledWith(`Body:\n ${JSON.stringify(sourceData)}`);
    expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
    expect(debug).toBeCalledWith(`API Response Data:\n`);
    expect(debug).toBeCalledWith(responseData);

    // Safe Method for CSRF no token lookup
    expect(mockLocalStorage).toBeCalledTimes(1);

    done();
  });

  it("handle a post request as expected, when an error occurs", async (done) => {
    statusCode = 200;
    responseData = { data: "Valuable Data" };
    contentType = "application/json";
    sourceData = { data: "Data to Post" };
    mockLocalStorage.mockImplementation(() => null);
    // No json method, throws error
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        headers: { get: () => contentType },
        status: statusCode,
      })
    );

    const [response, status] = await Backend("POST", requestPath, sourceData);

    expect(mockFetch).toBeCalledWith(requestPath, {
      body: JSON.stringify(sourceData),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    expect(status).toBe(500);
    expect(response).toBe(Constants.genericAPIError);

    expect(debug).toBeCalledTimes(2);
    expect(debug).toBeCalledWith(
      `API POST:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
    );
    expect(debug).toBeCalledWith(`Body:\n ${JSON.stringify(sourceData)}`);

    // Safe Method for CSRF no token lookup
    expect(mockLocalStorage).toBeCalledTimes(1);

    done();
  });
});
