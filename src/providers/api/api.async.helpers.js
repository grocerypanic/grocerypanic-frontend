import ApiActions from "./api.actions";
import { Constants, ItemFilters } from "../../configuration/backend";

export const authFailure = (dispatch, callback) => {
  new Promise((resolve) => {
    dispatch({ type: ApiActions.FailureAuth, callback });
  });
};

export const duplicateObject = (dispatch, callback) => {
  new Promise((resolve) => {
    dispatch({ type: ApiActions.DuplicateObject, callback });
  });
};

export const asyncDispatch = (dispatch, action) => {
  new Promise((resolve) => {
    dispatch(action);
  });
};

export const calculateListUrl = (action, path, additionalParam = {}) => {
  if (action.override) return action.override;

  const additionalParamString = new URLSearchParams(additionalParam).toString();

  let filterPath = "";

  if (action.filter) {
    for (const filterName of ItemFilters) {
      const filterValue = action.filter.get(filterName);
      if (filterValue) {
        if (filterPath === "") filterPath += "?";
        if (filterPath !== "?") filterPath += "&";
        filterPath += `${filterName}=${filterValue}`;
      }
    }
  }

  let url = path;
  if (action[Constants.pageLookupParam]) {
    const param = {};
    param[Constants.pageLookupParam] = action[Constants.pageLookupParam];
    url = url + "?" + new URLSearchParams(param).toString();
  }

  if (url.indexOf("?") > -1) {
    filterPath = filterPath.replace("?", "&");
  }

  if (additionalParamString) {
    if (url.indexOf("?") === -1) {
      url = url + "?";
    }
    url = url + additionalParamString;
  }

  return url + filterPath;
};
