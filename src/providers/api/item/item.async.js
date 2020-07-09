import { Paths } from "../../../configuration/backend";
import { match2xx, match400duplicate } from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import { authFailure, duplicateObject } from "../api.async.helpers";
import { generateConverter } from "../api.util.js";
import InitialState from "./item.initial";

import { ItemFilters, FilterTag } from "../../../configuration/backend";

const convertDatesToLocal = generateConverter(InitialState.class);

export const asyncAdd = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request("POST", Paths.manageItems, {
    ...action.payload,
  });
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      state.inventory.unshift(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: state.inventory,
        },
        callback,
      });
    });
  }
  // Duplicate Object Errors
  if (match400duplicate(status, response))
    return duplicateObject(dispatch, callback);
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureAdd,
    callback,
  });
};

export const asyncDel = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [, status] = await Request(
    "DELETE",
    Paths.manageItems + `${action.payload.id}/`
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessDel,
        payload: {
          inventory: state.inventory.filter(
            (item) => item.id !== action.payload.id
          ),
        },
        callback,
      });
    });
  }
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureDel,
    callback,
  });
};

export const asyncGet = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "GET",
    Paths.manageItems + `${action.payload.id}/`
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    // Update the item in state if it exists, otherwise add it as a new item
    const newInventory = [...state.inventory];
    const index = newInventory.findIndex(
      (item) => item.id === action.payload.id
    );
    if (index >= 0) newInventory[index] = convertDatesToLocal(response);
    if (index < 0) newInventory.push(convertDatesToLocal(response));
    new Promise((resolve) =>
      dispatch({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: newInventory,
        },
        callback,
      })
    );
    return;
  }
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureGet,
    callback,
  });
};

export const asyncList = async ({ state, action }) => {
  const { dispatch, filter, callback } = action;
  let filterPath = "";
  let FilterNames = [...ItemFilters, FilterTag];
  if (filter) {
    for (const filterName of FilterNames) {
      const filterValue = filter.get(filterName);
      if (filterValue) {
        if (filterPath === "") filterPath += "?";
        if (filterPath !== "?") filterPath += "&";
        filterPath += `${filterName}=${filterValue}`;
      }
    }
  }
  const [response, status] = await Request(
    "GET",
    action.override ? action.override : Paths.manageItems + filterPath
  );
  if (match2xx(status)) {
    const processedResponse = response.results.map((i) =>
      convertDatesToLocal(i)
    );
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: {
          inventory: processedResponse,
          next: response.next,
          previous: response.previous,
        },
        callback,
      });
    });
  }
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureList,
    callback,
  });
};

export const asyncUpdate = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "PUT",
    Paths.manageItems + `${action.payload.id}/`,
    { ...action.payload }
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    const index = state.inventory.findIndex(
      (item) => item.id === action.payload.id
    );
    state.inventory[index] = convertDatesToLocal(response);
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessUpdate,
        payload: {
          inventory: state.inventory,
        },
        callback,
      });
    });
  }
  // Duplicate Object Errors
  if (match400duplicate(status, response))
    return duplicateObject(dispatch, callback);
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureUpdate,
    callback,
  });
};
