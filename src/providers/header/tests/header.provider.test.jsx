import React from "react";
import { act, render, cleanup, waitFor } from "@testing-library/react";
import HeaderProvider, { HeaderContext } from "../header.provider";

import InitialState from "../header.initial";

describe("Check the Inital Provider State", () => {
  afterEach(cleanup);

  it("should have the expected default values", () => {
    let received = {};
    render(
      <HeaderProvider>
        <HeaderContext.Consumer>
          {(state) => (
            <div>
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key];
              })}
            </div>
          )}
        </HeaderContext.Consumer>
      </HeaderProvider>
    );
    expect(Object.keys(received).length).toBe(2);
    expect(received.headerSettings).toStrictEqual(InitialState.headerSettings);

    expect(received.updateHeader).toBeInstanceOf(Function);
  });

  it("the update function should work as expected when given properties", async () => {
    let received = {};
    render(
      <HeaderProvider>
        <HeaderContext.Consumer>
          {(state) => (
            <div>
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key];
              })}
            </div>
          )}
        </HeaderContext.Consumer>
      </HeaderProvider>
    );

    const attrs = {
      title: "new title",
      create: "placeholder string",
      transaction: true,
      disableNav: false,
      signIn: false,
    };

    act(() => received.updateHeader(attrs));

    await waitFor(() => expect(received.headerSettings).toStrictEqual(attrs));
  });
});
