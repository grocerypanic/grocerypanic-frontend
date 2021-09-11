import { render, cleanup, waitFor } from "@testing-library/react";
import i18next from "i18next";
import React from "react";
import Dialogue from "../../../components/dialogue/dialogue.component";
import Header from "../../../components/header/header.component";
import Strings from "../../../configuration/strings";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import MaintenancePage from "../maintenance.page";

jest.mock("../../../components/dialogue/dialogue.component");
jest.mock("../../../components/header/header.component");

Dialogue.mockImplementation(() => <div>MockDialogue</div>);
Header.mockImplementation(() => <div>MockHeader</div>);

const mockHeaderUpdate = jest.fn();

describe("Check the correct props are passed to ", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <MaintenancePage />
      </HeaderContext.Provider>
    );
  });

  afterEach(cleanup);

  const checkHeader = () => {
    expect(Header).toBeCalledTimes(1);
    expect(mockHeaderUpdate).toBeCalledWith({
      title: "MainHeaderTitle",
      disableNav: true,
    });
    expect(i18next.t("MainHeaderTitle")).toBe(Strings.MainHeaderTitle);
  };

  it("should render the details page correctly", async () => {
    await waitFor(() => expect(Dialogue).toBeCalledTimes(1));
    const props = Dialogue.mock.calls[0][0];
    propCount(props, 4);

    expect(props.title).toBe(Strings.Maintenance.Title);
    expect(props.headerTitle).toBe(Strings.Maintenance.HeaderTitle);
    expect(props.body).toBe(Strings.Maintenance.Body);
    expect(props.Footer).toBeInstanceOf(Function);
  });

  it("the footer should return an empty div", async () => {
    await waitFor(() => expect(Dialogue).toBeCalledTimes(1));
    const footer = Dialogue.mock.calls[0][0].Footer;
    expect(footer()).toStrictEqual(<div></div>);
  });

  it("should configure the header properly", () => {
    checkHeader();
  });
});
