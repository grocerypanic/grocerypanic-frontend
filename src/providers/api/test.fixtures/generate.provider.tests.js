import React from "react";
import { render, cleanup } from "@testing-library/react";

export const ProviderTest = (Provider, Context, InitialState) => {
  describe("Check the Inital Provider State", () => {
    afterEach(cleanup);

    it("should have the expected default values", () => {
      let received = {};
      render(
        <Provider>
          <Context.Consumer>
            {(state) => (
              <div>
                {Object.keys(state).forEach(function (key) {
                  received[key] = state[key];
                })}
              </div>
            )}
          </Context.Consumer>
        </Provider>
      );
      expect(Object.keys(received).length).toBe(2);
      expect(received.dispatch).toBeInstanceOf(Function);
      expect(received.apiObject).toBe(InitialState);
    });
  });
};
