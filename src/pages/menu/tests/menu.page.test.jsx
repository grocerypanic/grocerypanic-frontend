import { render, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import Menu from "../../../components/menu/menu.component";
import Options from "../../../configuration/menu";
import Strings from "../../../configuration/strings";
import { propCount } from "../../../test.fixtures/objectComparison";
import MenuPage from "../menu.page";

jest.mock("../../../components/menu/menu.component");
Menu.mockImplementation(() => <div>MockList</div>);

const mockDispatch = jest.fn();

describe("Check the correct props are passed to the menu", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(<MenuPage />);
  });

  afterEach(cleanup);

  it("should render the menu page correctly", async () => {
    await waitFor(() => expect(Menu).toBeCalledTimes(1));
    const props = Menu.mock.calls[0][0];
    propCount(props, 4);

    expect(props.title).toBe(Strings.MainMenu.Title);
    expect(props.headerTitle).toBe(Strings.MainMenu.HeaderTitle);
    expect(props.options).toBe(Options);
    expect(props.helpText).toBe(Strings.MainMenu.HelpText);

    expect(mockDispatch).toBeCalledTimes(0);
  });
});
