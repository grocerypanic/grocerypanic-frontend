import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import calculateMaxHeight from "../../../util/height";
import Hint from "../../hint/hint.component";
import MenuItem from "../../menu-item/menu-item.component";
import Menu from "../menu.component";

jest.mock("../../menu-item/menu-item.component");
jest.mock("../../hint/hint.component");
jest.mock("../../../util/height");

MenuItem.mockImplementation(() => <div>MockComponent</div>);
Hint.mockImplementation(() => <div>MockComponent</div>);
calculateMaxHeight.mockImplementation(() => 200);
const mockHeaderUpdate = jest.fn();

const props = {
  options: [{ name: "option1", location: "option1" }],
  headerTitle: "HeaderTitle",
  title: "Title",
  helpText: "HelpText",
};

describe("Setup environment", () => {
  let utils;
  let startPath = "/some/unmatched/path";
  const history = createBrowserHistory();

  beforeEach(() => {
    history.location.pathname = startPath;
    jest.clearAllMocks();
    utils = render(
      <Router history={history}>
        <HeaderContext.Provider
          value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
        >
          <Menu {...props} />
        </HeaderContext.Provider>
      </Router>
    );
  });

  afterEach(cleanup);

  it("renders, should call header with the correct params", () => {
    expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
    const headerCall = mockHeaderUpdate.mock.calls[0][0];
    expect(headerCall.title).toBe(props.headerTitle);
    expect(headerCall.create).toBe(null);
    expect(headerCall.transaction).toBe(false);
    expect(headerCall.disableNav).toBe(false);
  });

  it("should call the hint component with the correct props", () => {
    expect(Hint).toBeCalledTimes(1);
    const helpCall = Hint.mock.calls[0][0];
    propCount(helpCall, 1);
    expect(helpCall.children).toBe(props.helpText);
  });

  it("should call the menu item with the correct props", () => {
    expect(MenuItem).toBeCalledTimes(1);
    const menuItemCall = MenuItem.mock.calls[0][0];
    propCount(menuItemCall, 3);
    expect(menuItemCall.name).toBe(props.options[0].name);
    expect(menuItemCall.location).toBe(props.options[0].location);
    expect(menuItemCall.choose).toBeInstanceOf(Function);
  });

  it("should call calculateMaxHeight on render", () => {
    expect(calculateMaxHeight).toBeCalledTimes(1);
  });

  it("clicking on option1, should change the page accordingly", async () => {
    expect(MenuItem).toBeCalledTimes(1);
    const choose = MenuItem.mock.calls[0][0].choose;
    const newPath = "/a/new/path";

    await waitFor(() => expect(history.location.pathname).toBe(startPath));

    act(() => choose(newPath));

    await waitFor(() => expect(history.location.pathname).toBe(newPath));
  });

  it("a should call calculateMaxHeight again on a window resize", async () => {
    expect(calculateMaxHeight).toBeCalledTimes(1);
    fireEvent(window, new Event("resize"));
    await waitFor(() => expect(calculateMaxHeight).toBeCalledTimes(2));
  });

  it("should match the snapshot on file (styles)", () => {
    expect(utils.container).toMatchSnapshot();
  });
});
