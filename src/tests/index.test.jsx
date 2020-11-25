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

  it("should call render on the index object, and register the service worker as expected", () => {
    const { Index } = require("../index.js");
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    expect(ReactDOM.render).toHaveBeenCalledWith(<Index />, div);
    expect(serviceWorker.unregister).toHaveBeenCalledTimes(0);
    expect(serviceWorker.register).toHaveBeenCalledTimes(1);
  });
});
