import React from "react";
import ReactDOM from "react-dom";
import App from "../pages/app/app.js";
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

App.mockImplementation(() => <div>MockApp</div>);
serviceWorker.unregister.mockImplementation(() => jest.fn());

describe("Check Main Rendering", () => {
  beforeEach(() => {
    App.mockClear();
    serviceWorker.unregister.mockClear();
  });

  it("should call render on the index object, and register the service worker as expected", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    const { Index } = require("../index.js");
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    expect(ReactDOM.render).toHaveBeenCalledWith(<Index />, div);
    expect(serviceWorker.unregister).toHaveBeenCalledTimes(0);
    expect(serviceWorker.register).toHaveBeenCalledTimes(1);
  });

  it("should render the main application components without crashing", () => {
    jest.unmock("react-dom");
    const { render } = require("@testing-library/react");
    const { Index } = require("../index.js");
    const utils = render(<Index />);
    expect(utils.getByText("MockApp")).toBeTruthy();
    expect(RootProvider).toBeCalledTimes(1);
  });
});
