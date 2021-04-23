import React from "react";
import { render, cleanup } from "@testing-library/react";
import ShelfProvider, { ShelfContext } from "../shelf.provider";

import InitialState from "../shelf.initial";

describe("Check the Inital Provider State", () => {
  afterEach(cleanup);

  it("should have the expected default values", () => {
    let received = {};
    render(
      <ShelfProvider>
        <ShelfContext.Consumer>
          {(state) => (
            <div>
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key];
              })}
            </div>
          )}
        </ShelfContext.Consumer>
      </ShelfProvider>
    );
    expect(Object.keys(received).length).toBe(2);
    expect(received.dispatch).toBeInstanceOf(Function);
    expect(received.apiObject).toBe(InitialState);
  });
});
