import { Constants } from "../../../configuration/backend";
import debug from "../../debug";
import Backend from "../backend";

jest.mock("../../debug");
const mockLocalStorage = jest.spyOn(Storage.prototype, "getItem");

const mockFetch = jest.fn();

global.fetch = mockFetch;

let statusCode;
let responseData;
let contentType;
let sourceData;
let requestPath = "/somePath";
let requestType;

const originalEnvironment = process.env.REACT_APP_PANIC_BACKEND;
const phonyServer = "http://phonyserver";

describe("test the Backend method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_PANIC_BACKEND = phonyServer;
    responseData = { data: "Valuable Data" };
    mockLocalStorage.mockImplementation(() => "MockCSRFtoken");
  });

  afterEach(() => {
    process.env.REACT_APP_PANIC_BACKEND = originalEnvironment;
  });

  const setResponse = (
    currentContentType,
    curentResponseData,
    currentStatusCode
  ) => {
    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        headers: { get: () => currentContentType },
        json: () => Promise.resolve(curentResponseData),
        text: () => Promise.resolve(curentResponseData),
        status: currentStatusCode,
      });
    });
  };

  describe("Given a 200 response by the server", () => {
    beforeEach(() => {
      statusCode = 200;
    });

    describe("Given a GET request", () => {
      beforeEach(() => {
        requestType = "GET";
      });

      it("handles request as expected, when content type is json, and path is overriden", async () => {
        process.env.REACT_APP_PANIC_BACKEND = "http://mybackendserver";
        setResponse("application/json", responseData, statusCode);

        const [response, status] = await Backend(
          requestType,
          `${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );

        expect(mockFetch).toBeCalledWith(
          `${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: requestType,
          }
        );

        expect(status).toBe(statusCode);
        expect(response).toBe(responseData);

        expect(debug).toBeCalledTimes(4);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
        expect(debug).toBeCalledWith(`API Response Data:\n`);
        expect(debug).toBeCalledWith(responseData);

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(0);
      });

      it("handles request as expected, when content type is json", async () => {
        setResponse("application/json", responseData, statusCode);
        const [response, status] = await Backend(requestType, requestPath);

        expect(mockFetch).toBeCalledWith(phonyServer + requestPath, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: requestType,
        });

        expect(status).toBe(statusCode);
        expect(response).toBe(responseData);

        expect(debug).toBeCalledTimes(4);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
        expect(debug).toBeCalledWith(`API Response Data:\n`);
        expect(debug).toBeCalledWith(responseData);

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(0);
      });

      it("handles request as expected, when content type is text", async () => {
        setResponse("text/plain", "Text String", statusCode);
        const [response, status] = await Backend(requestType, requestPath);

        expect(mockFetch).toBeCalledWith(phonyServer + requestPath, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: requestType,
        });

        expect(status).toBe(statusCode);
        expect(response).toBe("Text String");

        expect(debug).toBeCalledTimes(4);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
        expect(debug).toBeCalledWith(`API Response Data:\n`);
        expect(debug).toBeCalledWith("Text String");

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(0);
      });

      it("handles request as expected, when content type is null", async () => {
        setResponse(null, "Text String", statusCode);
        responseData = "Text String";

        const [response, status] = await Backend(requestType, requestPath);

        expect(mockFetch).toBeCalledWith(phonyServer + requestPath, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: requestType,
        });

        expect(status).toBe(statusCode);
        expect(response).toBe(null);

        expect(debug).toBeCalledTimes(2);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(0);
      });
    });

    describe("Given a POST request", () => {
      beforeEach(() => {
        requestType = "POST";
      });

      it("handles request as expected", async () => {
        sourceData = { data: "Data to Post" };
        setResponse("application/json", responseData, statusCode);

        const [response, status] = await Backend(
          requestType,
          requestPath,
          sourceData
        );

        expect(mockFetch).toBeCalledWith(phonyServer + requestPath, {
          body: JSON.stringify(sourceData),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": "MockCSRFtoken",
          },
          method: requestType,
        });

        expect(status).toBe(statusCode);
        expect(response).toBe(responseData);

        expect(debug).toBeCalledTimes(5);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`Body:\n ${JSON.stringify(sourceData)}`);
        expect(debug).toBeCalledWith(`API Response Status Code:\n 200`);
        expect(debug).toBeCalledWith(`API Response Data:\n`);
        expect(debug).toBeCalledWith(responseData);

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(1);
      });
    });
  });

  describe("Given a 400 response by the server", () => {
    beforeEach(() => {
      statusCode = 400;
    });

    describe("Given a POST request", () => {
      beforeEach(() => {
        requestType = "POST";
      });

      it("handles request as expected", async () => {
        sourceData = { data: "Data to Post" };
        setResponse("application/json", responseData, statusCode);

        const [response, status] = await Backend(
          requestType,
          requestPath,
          sourceData
        );

        expect(mockFetch).toBeCalledWith(phonyServer + requestPath, {
          body: JSON.stringify(sourceData),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": "MockCSRFtoken",
          },
          method: requestType,
        });

        expect(status).toBe(statusCode);
        expect(response).toBe(responseData);

        expect(debug).toBeCalledTimes(5);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`Body:\n ${JSON.stringify(sourceData)}`);
        expect(debug).toBeCalledWith(`API Response Status Code:\n 400`);
        expect(debug).toBeCalledWith(`API Response Data:\n`);
        expect(debug).toBeCalledWith(responseData);

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(1);
      });
    });
  });

  describe("Given a 500 response by the server", () => {
    beforeEach(() => {
      statusCode = 500;
    });

    describe("Given a POST request", () => {
      beforeEach(() => {
        requestType = "POST";
      });

      it("handle a post request as expected, when an error occurs", async () => {
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

        const [response, status] = await Backend(
          requestType,
          requestPath,
          sourceData
        );

        expect(mockFetch).toBeCalledWith(phonyServer + requestPath, {
          body: JSON.stringify(sourceData),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: requestType,
        });

        expect(status).toBe(500);
        expect(response).toBe(Constants.genericAPIError);

        expect(debug).toBeCalledTimes(2);
        expect(debug).toBeCalledWith(
          `API ${requestType}:\n ${process.env.REACT_APP_PANIC_BACKEND}${requestPath}`
        );
        expect(debug).toBeCalledWith(`Body:\n ${JSON.stringify(sourceData)}`);

        // Safe Method for CSRF no token lookup
        expect(mockLocalStorage).toBeCalledTimes(1);
      });
    });
  });
});
