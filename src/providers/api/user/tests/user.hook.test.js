import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import ApiActions from "../../api.actions";

import useProfile from "../user.hook";
import InitialState from "../user.initial";

import { UserContext } from "../user.provider";

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
    expect(hook.current.user).toStrictEqual(InitialState);
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
    act(() => hook.current.getProfile());
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({ type: ApiActions.StartGet });
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
    act(() => hook.current.updateProfile(mockProfile));
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      type: ApiActions.StartUpdate,
      action: { payload: mockProfile },
    });
  });
});
