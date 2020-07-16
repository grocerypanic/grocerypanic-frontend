import React from "react";
import ReactDOM from "react-dom";
import App from "../pages/app/app.js";
import MaintenancePage from "../pages/maintenance/maintenance.page";
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

App.mockImplementation(() => <div>MockApp</div>);
MaintenancePage.mockImplementation(() => <div>MockMaintenance</div>);
serviceWorker.unregister.mockImplementation(() => jest.fn());

const environment = process.env;

describe("Setup Test", () => {
  let utils;
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

  it("should call render on the index object, and register the service worker as expected", () => {
    const { Index } = require("../index.js");
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    expect(ReactDOM.render).toHaveBeenCalledWith(<Index />, div);
    expect(serviceWorker.unregister).toHaveBeenCalledTimes(0);
    expect(serviceWorker.register).toHaveBeenCalledTimes(1);
  });

  describe("Outside of a maintenance event", () => {
    beforeEach(() => {
      jest.unmock("react-dom");
      const { render } = require("@testing-library/react");
      process.env.REACT_APP_MAINTENANCE = "false";
      const { Index } = require("../index.js");
      utils = render(<Index />);
    });

    it("should render the main application components without crashing", () => {
      jest.unmock("react-dom");
      expect(utils.getByText("MockApp")).toBeTruthy();
      expect(utils.queryByText("MockMaintenance")).toBeFalsy();
      expect(RootProvider).toBeCalledTimes(1);
    });
  });

  describe("During a maintenance event", () => {
    beforeEach(() => {
      jest.unmock("react-dom");
      const { render } = require("@testing-library/react");
      process.env.REACT_APP_MAINTENANCE = "true";
      const { Index } = require("../index.js");
      utils = render(<Index />);
    });

    it("should render the maintenance page without crashing", () => {
      expect(utils.getByText("MockMaintenance")).toBeTruthy();
      expect(utils.queryByText("MockApp")).toBeFalsy();
      expect(RootProvider).toBeCalledTimes(1);
    });
  });
});
