import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";
import { propCount } from "../../../../test.fixtures/objectComparison";
import ApiActions from "../../api.actions";
import ApiFunctions from "../../api.functions";
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
    propCount(call, 3);
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
    propCount(call, 4);
    expect(call.type).toBe(ApiActions.StartUpdate);
    expect(call.func).toBe(ApiFunctions.asyncUpdate);
    expect(call.dispatch).toBe(dispatchMock);
    expect(call.payload).toStrictEqual(mockProfile);
  });
});

describe("test clearErrors", () => {
  let hook;

  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to clear any api errors", () => {
    act(() => hook.current.profile.clearErrors());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 1);
    expect(call.type).toBe(ApiActions.ClearErrors);
  });
});
