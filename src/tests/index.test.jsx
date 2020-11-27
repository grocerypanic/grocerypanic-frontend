import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "../serviceWorker";
import RootProvider from "../providers/root.provider";

jest.mock("../providers/root.provider");
RootProvider.mockImplementation(({ children }) => <div>{children}</div>);

jest.mock("../serviceWorker", () => ({
  __esModule: true,
  unregister: jest.fn(),
  register: jest.fn(),
}));
jest.mock("react-dom", () => ({ render: jest.fn() }));
jest.mock("../pages/app/app");
jest.mock("../pages/maintenance/maintenance.page");

serviceWorker.unregister.mockImplementation(() => jest.fn());

const environment = process.env;

describe("Setup Test", () => {
  let div;
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
    div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
  });
  afterAll(() => {
    process.env = environment;
  });

  describe("when the update confirmation is accepted", () => {
    let mockRegistration;
    beforeEach(() => {
      jest.spyOn(global, "confirm").mockReturnValueOnce(true);
      mockRegistration = {
        waiting: {
          postMessage: jest.fn(),
        },
      };
      delete window.location;
      window.location = { ...window.location, reload: jest.fn() };
    });

    it("should call render on the index object, and register the service worker and perform updates as expected", () => {
      const { Index } = require("../index.js");
      expect(ReactDOM.render).toHaveBeenCalledTimes(1);
      expect(ReactDOM.render).toHaveBeenCalledWith(<Index />, div);
      expect(serviceWorker.unregister).toHaveBeenCalledTimes(0);
      expect(serviceWorker.register).toHaveBeenCalledTimes(1);

      const registerFn = serviceWorker.register.mock.calls[0][0];
      registerFn.onUpdate({});
      expect(window.location.reload).toBeCalledTimes(1);
    });

    it("when perform update is called it should post the SKIP_WAITING message and reload the page", () => {
      const { performUpdate } = require("../index.js");
      performUpdate({});
      expect(mockRegistration.waiting.postMessage).toBeCalledTimes(0);
      expect(window.location.reload).toBeCalledTimes(1);
    });

    it("when perform update is called it should reload the page but not post the message if there is not a waiting object", () => {
      const { performUpdate } = require("../index.js");
      performUpdate(mockRegistration);
      expect(mockRegistration.waiting.postMessage).toBeCalledWith({
        type: "SKIP_WAITING",
      });
      expect(window.location.reload).toBeCalledTimes(1);
    });
  });

  describe("when the update confirmation is not accepted", () => {
    let mockRegistration;
    beforeEach(() => {
      jest.spyOn(global, "confirm").mockReturnValueOnce(false);
      mockRegistration = {
        waiting: {
          postMessage: jest.fn(),
        },
      };
      delete window.location;
      window.location = { ...window.location, reload: jest.fn() };
    });

    it("should not perform updates", () => {
      const { performUpdate } = require("../index.js");
      performUpdate(mockRegistration);
      expect(mockRegistration.waiting.postMessage).toBeCalledTimes(0);
      expect(window.location.reload).toBeCalledTimes(0);
    });
  });
});
