import { GoogleOAuthProvider } from "@react-oauth/google";
import { render } from "@testing-library/react";
import React from "react";
import { propCount } from "../../../test.fixtures/objectComparison";
import InitialState from "../social.initial";
import SocialProvider, { SocialContext } from "../social.provider";

jest.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe("Check the Initial Provider State", () => {
  let received = {};

  const originalEnvironment = process.env;
  const mockGoogleClientId = "mockGoogleClientId";

  beforeAll(
    () => (process.env.REACT_APP_GOOGLE_ACCOUNT_ID = mockGoogleClientId)
  );

  afterAll(() => (process.env = originalEnvironment));

  beforeEach(() => {
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
  });

  it("should initialize the GoogleOAuthProvider with the correct props", () => {
    expect(GoogleOAuthProvider).toBeCalledTimes(1);
    const props = GoogleOAuthProvider.mock.calls[0][0];
    propCount(props, 2);
    expect(props.children).toBeDefined();
    expect(props.clientId).toBe(mockGoogleClientId);
  });

  it("should have the expected default values", () => {
    expect(Object.keys(received).length).toBe(2);
    expect(received.dispatch).toBeInstanceOf(Function);
    expect(received.socialLogin).toStrictEqual(InitialState);
  });
});
