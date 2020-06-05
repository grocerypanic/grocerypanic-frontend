import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import MenuPage from "../menu.page";
import Menu from "../../../components/menu/menu.component";

import Strings from "../../../configuration/strings";
import Options from "../../../configuration/menu";

jest.mock("../../../components/menu/menu.component");
Menu.mockImplementation(() => <div>MockList</div>);

const mockDispatch = jest.fn();

describe("Check the correct props are passed to the menu", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();

    currentTest = tests.shift();
    utils = render(<MenuPage />);
  });

  afterEach(cleanup);

  it("should render the menu page correctly", async (done) => {
    await waitFor(() => expect(Menu).toBeCalledTimes(1));
    const props = Menu.mock.calls[0][0];
    propCount(props, 4);

    expect(props.title).toBe(Strings.MainMenuPageTitle);
    expect(props.headerTitle).toBe(Strings.MainMenuPageHeaderTitle);
    expect(props.options).toBe(Options);
    expect(props.helpText).toBe(Strings.MainMenuHelpText);

    expect(mockDispatch).toBeCalledTimes(0);
    done();
  });
});
