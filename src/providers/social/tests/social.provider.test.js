import { render, cleanup } from "@testing-library/react";
import React from "react";
import InitialState from "../social.initial";
import SocialProvider, { SocialContext } from "../social.provider";

describe("Check the Inital Provider State", () => {
  afterEach(cleanup);

  it("should have the expected default values", () => {
    let received = {};
    render(
      <SocialProvider>
        <SocialContext.Consumer>
          {(state) => (
            <div>
              {Object.keys(state).forEach(function (key) {
                received[key] = state[key];
              })}
            </div>
          )}
        </SocialContext.Consumer>
      </SocialProvider>
    );
    expect(Object.keys(received).length).toBe(2);
    expect(received.dispatch).toBeInstanceOf(Function);
    expect(received.socialLogin).toBe(InitialState);
  });
});
