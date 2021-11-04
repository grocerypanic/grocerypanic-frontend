import { render, cleanup } from "@testing-library/react";
import InitialState from "../user.initial";
import UserProvider, { UserContext } from "../user.provider";
import type { UserContextInterface } from "../types/user.context";

describe("Check the Initial Provider State", () => {
  const received = {} as Partial<UserContextInterface>;

  beforeEach(() => arrange());

  afterEach(cleanup);

  const arrange = () => {
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(state) => (
            <div>{JSON.stringify(Object.assign(received, state))}</div>
          )}
        </UserContext.Consumer>
      </UserProvider>
    );
  };

  it("should have the expected default values", () => {
    expect(Object.keys(received).length).toBe(2);
    expect(received.dispatch).toBeInstanceOf(Function);
    expect(received.socialLogin).toBe(InitialState);
  });
});
