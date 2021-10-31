import { render } from "@testing-library/react";
import React from "react";
import App from "../pages/app/app.js";
import MaintenancePage from "../pages/maintenance/maintenance.page";
import RootProvider from "../providers/root.provider";

jest.mock("../providers/root.provider");
RootProvider.mockImplementation(({ children }) => <div>{children}</div>);

jest.mock("../serviceWorker", () => ({
  __esModule: true,
  unregister: jest.fn(),
  register: jest.fn(),
}));
jest.mock("../pages/app/app");
jest.mock("../pages/maintenance/maintenance.page");

App.mockImplementation(() => <div>MockApp</div>);
MaintenancePage.mockImplementation(() => <div>MockMaintenance</div>);

const environment = process.env;

describe("Setup Test", () => {
  let utils;
  let div;

  beforeEach(() => {
    document.body.innerHTML = "";
    div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
  });

  afterAll(() => {
    process.env = environment;
  });

  describe("Outside of a maintenance event", () => {
    beforeEach(() => {
      const { Index } = require("../index.js");
      document.body.innerHTML = "";
      jest.clearAllMocks();

      process.env.REACT_APP_MAINTENANCE = "false";
      utils = render(<Index />);
    });

    it("should render the main application components without crashing", () => {
      expect(utils.getByText("MockApp")).toBeTruthy();
      expect(utils.queryByText("MockMaintenance")).toBeFalsy();
      expect(RootProvider).toBeCalledTimes(2);
    });
  });

  describe("During a maintenance event", () => {
    beforeEach(() => {
      const { Index } = require("../index.js");
      document.body.innerHTML = "";
      jest.clearAllMocks();

      process.env.REACT_APP_MAINTENANCE = "true";
      utils = render(<Index />);
    });

    it("should render the maintenance page without crashing", () => {
      expect(utils.getByText("MockMaintenance")).toBeTruthy();
      expect(utils.queryByText("MockApp")).toBeFalsy();
      expect(RootProvider).toBeCalledTimes(2);
    });
  });
});
