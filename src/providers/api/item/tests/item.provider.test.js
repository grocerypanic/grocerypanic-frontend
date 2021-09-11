import { render, cleanup } from "@testing-library/react";
import React from "react";
import InitialState from "../item.initial";
import ItemProvider, { ItemContext } from "../item.provider";

describe("Check the Inital Provider State", () => {
  afterEach(cleanup);

  it("should have the expected default values", () => {
    let received = {};
    render(
      <ItemProvider>
        <ItemContext.Consumer>
          {(state) => (
            <div>
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key];
              })}
            </div>
          )}
        </ItemContext.Consumer>
      </ItemProvider>
    );
    expect(Object.keys(received).length).toBe(2);
    expect(received.dispatch).toBeInstanceOf(Function);
    expect(received.apiObject).toBe(InitialState);
  });
});
