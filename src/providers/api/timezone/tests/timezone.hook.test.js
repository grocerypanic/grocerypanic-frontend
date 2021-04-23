import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import ApiActions from "../../api.actions";

import useTimezones from "../timezone.hook";
import InitialState from "../timezone.initial";

import { TimezoneContext } from "../timezone.provider";
import ApiFunctions from "../../api.functions";

import { propCount } from "../../../../test.fixtures/objectComparison";

const dispatchMock = jest.fn();
const providerWrapper = ({ state, ...props }) => {
  const providerContext = {
    dispatch: dispatchMock,
    apiObject: { ...state, ...InitialState },
  };
  return <TimezoneContext.Provider value={providerContext} {...props} />;
};

const customRender = (providerProps) => {
  return renderHook(() => useTimezones(), {
    wrapper: providerWrapper,
    initialProps: {
      ...providerProps,
    },
  });
};

describe("test useTimezones default initial state", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should have the correct Initial State", () => {
    expect(hook.current.timezones.timezones).toStrictEqual(InitialState);
  });
});

describe("test getTimezones", () => {
  let hook;
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = customRender(InitialState);
    hook = result;
  });

  it("should dispatch to get the user's profile", () => {
    act(() => hook.current.timezones.getTimezones());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 3);
    expect(call.type).toBe(ApiActions.StartList);
    expect(call.func).toBe(ApiFunctions.asyncList);
    expect(call.dispatch).toBe(dispatchMock);
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
    act(() => hook.current.timezones.clearErrors());
    expect(dispatchMock).toBeCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    propCount(call, 1);
    expect(call.type).toBe(ApiActions.ClearErrors);
  });
});
