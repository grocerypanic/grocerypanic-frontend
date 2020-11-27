import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "../serviceWorker";
import RootProvider from "../providers/root.provider";
import { waitFor } from "@testing-library/react";

jest.mock("../providers/root.provider");
RootProvider.mockImplementation(({ children }) => <div>{children}</div>);

jest.mock("../serviceWorker", () => ({
  __esModule: true,
  unregister: jest.fn(),
  register: jest.fn(),
}));

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  render: jest.fn(),
}));
jest.mock("../pages/app/app");
jest.mock("../pages/maintenance/maintenance.page");

serviceWorker.unregister.mockImplementation(() => jest.fn());

const environment = process.env;

const mockRegistration = {
  waiting: {
    postMessage: jest.fn(),
  },
};

describe("Setup Test", () => {
  let div;
  let registerFn;
  let IndexComponent;
  beforeAll(() => {
    document.body.innerHTML = "";
    div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    const { Index } = require("../index.js");
    IndexComponent = Index;
  });
  afterAll(() => {
    process.env = environment;
  });

  describe("when index.js is run", () => {
    beforeEach(async () => {
      jest.spyOn(global, "confirm").mockReturnValueOnce(true);
      delete window.location;
      window.location = { ...window.location, reload: jest.fn() };
      await waitFor(() =>
        expect(serviceWorker.register).toHaveBeenCalledTimes(1)
      );
      registerFn = serviceWorker.register.mock.calls[0][0];
    });

    it("should insert the react content as expected", () => {
      expect(ReactDOM.render).toHaveBeenCalledTimes(1);
      expect(ReactDOM.render).toHaveBeenCalledWith(<IndexComponent />, div);
    });

    it("the service worker update handler should not reload the page when called without a registration", () => {
      registerFn.onUpdate({});
      expect(window.location.reload).toBeCalledTimes(0);
      expect(mockRegistration.waiting.postMessage).toBeCalledTimes(0);
    });

    it("the service worker update handler should not reload the page when called without a registration", () => {
      registerFn.onUpdate(mockRegistration);
      expect(window.location.reload).toBeCalledTimes(1);
      expect(mockRegistration.waiting.postMessage).toBeCalledTimes(1);
      expect(mockRegistration.waiting.postMessage).toBeCalledWith({
        type: "SKIP_WAITING",
      });
    });
  });
});
