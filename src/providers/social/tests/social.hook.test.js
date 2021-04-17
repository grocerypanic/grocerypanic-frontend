import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { propCount } from "../../../test.fixtures/objectComparison";

import SocialActions from "../social.actions";
import { Providers } from "../../../configuration/backend";

import useSocialLogin from "../social.hook";
import InitialState from "../social.initial";

import { SocialContext } from "../social.provider";
import * as asyncFn from "../social.async";

const dispatchMock = jest.fn();
const providerWrapper = ({ state, ...props }) => {
  const providerContext = {
    dispatch: dispatchMock,
    socialLogin: { ...state, ...InitialState },
  };
  return <SocialContext.Provider value={providerContext} {...props} />;
};

const customRender = (providerProps) => {
  return renderHook(() => useSocialLogin(), {
    wrapper: providerWrapper,
    initialProps: {
      ...providerProps,
    },
  });
};

describe("test useSocialLogin default initial state", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should have the correct Initial State", () => {
    expect(hook.current.social.socialLogin).toStrictEqual(InitialState);
  });
});

describe("test reset", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to reset the user's login", () => {
    act(() => hook.current.social.reset());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    expect(call.type).toBe(SocialActions.ResetUser);
  });
});

describe("test login", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should not dispatch to login the user if the response has no provider", () => {
    const mockResponse = "response without provider";
    act(() => hook.current.social.login(mockResponse));
    expect(dispatchMock).toBeCalledTimes(0);
  });

  it("should dispatch to login the user", () => {
    const mockResponse = { _provider: Providers.google };
    act(() => hook.current.social.login(mockResponse));
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 4);
    expect(call.type).toBe(SocialActions.StartFetchUser);
    expect(call.payload).toBe(mockResponse);
    expect(call.func).toBe(asyncFn.asyncLogin);
    expect(call.dispatch).toBeInstanceOf(Function);
  });
});

describe("test error", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to report a failed login", () => {
    act(() => hook.current.social.error());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 2);
    expect(call.type).toBe(SocialActions.FailureFetchUser);
    expect(call.payload.username).toBe("");
  });

  it("should dispatch to report a failed login, with a specified username", () => {
    act(() => hook.current.social.error("username"));
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 2);
    expect(call.type).toBe(SocialActions.FailureFetchUser);
    expect(call.payload.username).toBe("username");
  });
});

describe("test expiredAuth", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to report an expired login", () => {
    act(() => hook.current.social.expiredAuth());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 2);
    expect(call.type).toBe(SocialActions.AuthExpired);
    expect(call.payload.username).toBe("");
  });
});
