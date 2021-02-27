import React from "react";
import RootProvider from "../providers/root.provider";
import { waitFor } from "@testing-library/react";

jest.mock("../providers/root.provider");
jest.mock("../pages/app/app");
jest.mock("../pages/maintenance/maintenance.page");

RootProvider.mockImplementation(({ children }) => <div>{children}</div>);

describe("Setup Test", () => {
  let div;
  let registerFn;
  let IndexComponent;
  let serviceWorker;
  let ReactDOM;
  let environment;
  let mockRegistration;

  const render = () => {
    setUpMocks();
    document.body.innerHTML = "";
    div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);

    serviceWorker = require("../serviceWorker");
    ReactDOM = require("react-dom");
    const { Index } = require("../index.js");
    IndexComponent = Index;
  };

  const setUpMocks = () => {
    jest.resetAllMocks();

    jest.mock("../serviceWorker", () => ({
      __esModule: true,
      unregister: jest.fn(),
      register: jest.fn(),
    }));
    jest.mock("react-dom", () => ({
      ...jest.requireActual("react-dom"),
      render: jest.fn(),
    }));

    mockRegistration = {
      waiting: {
        postMessage: jest.fn(),
      },
    };
  };

  beforeAll(() => {
    environment = process.env;
  });

  afterAll(() => {
    process.env = environment;
  });

  describe("when index.js is run", () => {
    describe("when the website is in maintenance mode", () => {
      beforeAll(() => {
        jest.resetModules();
        process.env.REACT_APP_MAINTENANCE = "true";
        render();
      });

      it("should unregister the service worker", async () => {
        await waitFor(() =>
          expect(serviceWorker.unregister).toHaveBeenCalledTimes(1)
        );
      });
    });

    describe("when the website is not maintenance mode", () => {
      let originalLocation;
      beforeAll(() => {
        originalLocation = window.location;
        jest.resetModules();
        process.env.REACT_APP_MAINTENANCE = "false";
        render();
      });

      afterAll(() => {
        window.location = originalLocation;
      });

      beforeEach(async () => {
        jest.spyOn(global, "confirm").mockReturnValueOnce(true);
        delete window.location;
        window.location = { ...window.location, reload: jest.fn() };
      });

      it("should insert the react content as expected", async () => {
        await waitFor(() =>
          expect(serviceWorker.register).toHaveBeenCalledTimes(1)
        );
        expect(ReactDOM.render).toHaveBeenCalledTimes(1);
        expect(ReactDOM.render).toHaveBeenCalledWith(<IndexComponent />, div);
      });

      it("the service worker update handler should not reload the page when called without a registration", async () => {
        await waitFor(() =>
          expect(serviceWorker.register).toHaveBeenCalledTimes(1)
        );
        registerFn = serviceWorker.register.mock.calls[0][0];
        registerFn.onUpdate({});
        expect(window.location.reload).toBeCalledTimes(0);
        expect(mockRegistration.waiting.postMessage).toBeCalledTimes(0);
      });

      it("the service worker update handler should not reload the page when called without a registration", async () => {
        await waitFor(() =>
          expect(serviceWorker.register).toHaveBeenCalledTimes(1)
        );
        registerFn.onUpdate(mockRegistration);
        expect(window.location.reload).toBeCalledTimes(1);
        expect(mockRegistration.waiting.postMessage).toBeCalledTimes(1);
        expect(mockRegistration.waiting.postMessage).toBeCalledWith({
          type: "SKIP_WAITING",
        });
      });
    });
  });
});
