import { Paths } from "../../../configuration/backend";
import match2xx from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import { apiResultCompare, convertDatesToLocal } from "../api.util.js";

import { ItemFilters, FilterTag } from "../../../configuration/backend";

const authFailure = (dispatch, callback) => {
  return new Promise(function (resolve) {
    dispatch({ type: ApiActions.FailureAuth, callback });
  });
};

export const asyncAdd = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request("POST", Paths.manageItems, {
    ...action.payload,
  });
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      const newInventory = [...state.inventory];
      newInventory.push(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: [...newInventory].sort(apiResultCompare),
        },
        callback,
      });
    });
  }
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
          inventory: state.inventory
            .filter((item) => item.id !== action.payload.id)
            .sort(apiResultCompare),
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
    const index = state.inventory.findIndex(
      (item) => item.id === action.payload.id
    );
    const newInventory = [...state.inventory];
    if (index >= 0) newInventory[index] = convertDatesToLocal(response);
    if (index < 0) newInventory.push(convertDatesToLocal(response));
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: [...newInventory].sort(apiResultCompare),
        },
        callback,
      });
    });
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
    Paths.manageItems + filterPath
  );
  if (match2xx(status)) {
    const processedResponse = response.map((i) => convertDatesToLocal(i));
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: { inventory: processedResponse.sort(apiResultCompare) },
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
    const newInventory = [...state.inventory];
    const index = newInventory.findIndex(
      (item) => item.id === action.payload.id
    );
    newInventory[index] = convertDatesToLocal(response);
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessUpdate,
        payload: {
          inventory: [...newInventory].sort(apiResultCompare),
        },
        callback,
      });
    });
  }
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureUpdate,
    callback,
  });
};
