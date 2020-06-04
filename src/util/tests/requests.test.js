import { waitFor } from "@testing-library/react";

import Request from "../requests";
import Backend from "../requests/backend";
import RefreshCSRF from "../requests/csrf";

import { Constants } from "../../configuration/backend";

jest.mock("../requests/backend");
jest.mock("../requests/csrf");

describe("test the Request method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call refresh csrf on a csrf error as expected", async (done) => {
    Backend.mockImplementation(() => [
      { error: Constants.csrfErrorMessage },
      403,
    ]);

    const data = { datavalue: 1 };
    Request("POST", "/some/path", data);

    await waitFor(() => expect(RefreshCSRF).toBeCalledTimes(1));
    expect(Backend).toBeCalledTimes(2);
    done();
  });

  it("should not call refresh as expected", async (done) => {
    Backend.mockImplementation(() => [{ data: "valuable data" }, 200]);
    const data = { datavalue: 1 };
    Request("POST", "/some/path", data);

    await waitFor(() => expect(RefreshCSRF).toBeCalledTimes(0));
    expect(Backend).toBeCalledTimes(1);
    done();
  });

  it("should not call refresh as expected, get method", async (done) => {
    Backend.mockImplementation(() => [{ data: "valuable data" }, 200]);
    Request("GET", "/some/path");

    await waitFor(() => expect(RefreshCSRF).toBeCalledTimes(0));
    expect(Backend).toBeCalledTimes(1);
    done();
  });
});
