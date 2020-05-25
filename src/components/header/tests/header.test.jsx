import React from "react";
import { render, cleanup } from "@testing-library/react";

import Header from "../header.component";
import * as bootstrap from "react-bootstrap";
import * as addIcon from "@material-ui/icons/Add";
import { UserContext } from "../../../providers/user/user.provider";

jest.unmock("react-bootstrap");
bootstrap.Spinner = jest.fn();
bootstrap.Spinner.mockImplementation(() => <div>MockSpinner</div>);

jest.mock("@material-ui/icons/Add", () => ({
  __esModule: true,
  default: jest.fn(),
}));
addIcon.default.mockImplementation(() => <div>MockCreate</div>);

describe("Setup Environment", () => {
  let tests = [true, false];
  let utils;
  let currentTest;
  const create = jest.fn();

  beforeEach(() => {
    currentTest = tests.shift();
    jest.clearAllMocks();
    utils = render(
      <UserContext.Provider>
        <Header title="Some Title" create={create} transaction={currentTest} />
      </UserContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render title, and a spinner during a transaction", () => {
    expect(currentTest).toBe(true);
    expect(utils.getByText("Some Title")).toBeTruthy();
    expect(bootstrap.Spinner).toHaveBeenCalledTimes(1);
    expect(addIcon.default).toHaveBeenCalledTimes(0);
  });

  it("should render title, and the create button outside of transactions", () => {
    expect(currentTest).toBe(false);
    expect(utils.getByText("Some Title")).toBeTruthy();
    expect(bootstrap.Spinner).toHaveBeenCalledTimes(0);
    expect(addIcon.default).toHaveBeenCalledTimes(1);
  });
});
