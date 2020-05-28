import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";

import ShelvesPage from "../shelves.page";
import SimpleList from "../../../components/simple-list/simple-list.component";

import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";

import Strings from "../../../configuration/strings";

jest.mock("../../../components/simple-list/simple-list.component");
SimpleList.mockImplementation(() => <div>MockList</div>);

describe("Check the correct props are passed to simple list", () => {
  let tests = [1];
  let utils;
  let currentTest;

  beforeEach(() => {
    jest.clearAllMocks();

    currentTest = tests.shift();
    utils = render(
      <ShelfContext.Provider>
        <ShelvesPage />
      </ShelfContext.Provider>
    );
  });

  afterEach(cleanup);

  it("should render the root page correctly", async (done) => {
    await waitFor(() => expect(SimpleList).toBeCalledTimes(1));
    const props = SimpleList.mock.calls[0][0];
    expect(props.title).toBe(Strings.ShelfPageTitle);
    expect(props.headerTitle).toBe(Strings.ShelfPageHeaderTitle);
    expect(props.ApiObjectContext).toBe(ShelfContext);
    done();
  });
});
