import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import ApiActions from "../../api.actions";

import useProfile from "../user.hook";
import InitialState from "../user.initial";

import { UserContext } from "../user.provider";
import ApiFunctions from "../../api.functions";

const dispatchMock = jest.fn();
const providerWrapper = ({ state, ...props }) => {
  const providerContext = {
    dispatch: dispatchMock,
    apiObject: { ...state, ...InitialState },
  };
  return <UserContext.Provider value={providerContext} {...props} />;
};

const customRender = (providerProps) => {
  return renderHook(() => useProfile(), {
    wrapper: providerWrapper,
    initialProps: {
      ...providerProps,
    },
  });
};

describe("test useProfile default initial state", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should have the correct Initial State", () => {
    expect(hook.current.profile.user).toStrictEqual(InitialState);
  });
});

describe("test getProfile", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to get the user's profile", () => {
    act(() => hook.current.profile.getProfile());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    expect(call.type).toBe(ApiActions.StartGet);
    expect(call.func).toBe(ApiFunctions.asyncGet);
    expect(call.dispatch).toBe(dispatchMock);
  });
});

describe("test updateProfile", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to update the user's profile", () => {
    const mockProfile = { id: 2, username: "Niall" };
    act(() => hook.current.profile.updateProfile(mockProfile));
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    expect(call.type).toBe(ApiActions.StartUpdate);
    expect(call.func).toBe(ApiFunctions.asyncUpdate);
    expect(call.dispatch).toBe(dispatchMock);
    expect(call.action).toStrictEqual({ payload: mockProfile });
  });
});
