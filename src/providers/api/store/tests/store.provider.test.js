import { render, cleanup } from "@testing-library/react";
import React from "react";
import InitialState from "../store.initial";
import StoreProvider, { StoreContext } from "../store.provider";

describe("Check the Inital Provider State", () => {
  afterEach(cleanup);

  it("should have the expected default values", () => {
    let received = {};
    render(
      <StoreProvider>
        <StoreContext.Consumer>
          {(state) => (
            <div>
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key];
              })}
            </div>
          )}
        </StoreContext.Consumer>
      </StoreProvider>
    );
    expect(Object.keys(received).length).toBe(2);
    expect(received.dispatch).toBeInstanceOf(Function);
    expect(received.apiObject).toBe(InitialState);
  });
});
