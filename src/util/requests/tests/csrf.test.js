import { waitFor } from "@testing-library/react";
import { Paths, Constants } from "../../../configuration/backend";
import Backend from "../backend";
import RefreshCSRF from "../csrf";

const mockLocalStorage = jest.spyOn(Storage.prototype, "setItem");
jest.mock("../backend");

const mockToken = "MockToken";

describe("test the RefreshCSRF method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the refresh end point as expected and store the token", async () => {
    Backend.mockImplementation(() => [
      {
        token: mockToken,
      },
      200,
    ]);

    RefreshCSRF();

    await waitFor(() => expect(Backend).toBeCalledTimes(1));
    expect(Backend).toBeCalledWith("GET", Paths.refreshCSRF);
    expect(mockLocalStorage).toBeCalledTimes(1);
    expect(mockLocalStorage).toBeCalledWith(
      Constants.csrfLocalStorage,
      mockToken
    );
  });

  it("should call the refresh end point as expected, if the call fails it should not store the token", async () => {
    Backend.mockImplementation(() => [
      {
        token: mockToken,
      },
      400,
    ]);

    RefreshCSRF();

    await waitFor(() => expect(Backend).toBeCalledTimes(1));
    expect(Backend).toBeCalledWith("GET", Paths.refreshCSRF);
    expect(mockLocalStorage).toBeCalledTimes(0);
  });
});
