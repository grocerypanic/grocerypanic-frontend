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

  let extraParams = "";
  let filterParams = "";
  let url = path;
  let paginationParams = "";
  let paginationOverideParams = "";
  let param = {};

  if (action.filter) {
    param = {};
    for (const filterName of ItemFilters) {
      const filterValue = action.filter.get(filterName);
      if (filterValue) {
        param[filterName] = filterValue;
      }
      filterParams = new URLSearchParams(param).toString();
    }
  }

  if (action.page) {
    param = {};
    param[Constants.pageLookupParam] = action.page;
    paginationParams = paginationParams + new URLSearchParams(param).toString();
  }

  if (action.fetchAll) {
    param = {};
    param[Constants.pageOverrideParam] = action.fetchAll;
    paginationOverideParams =
      paginationOverideParams + new URLSearchParams(param).toString();
  }

  if (additionalParamString) {
    extraParams = additionalParam;
  }

  // Assemble URL
  const assembledParams = [
    paginationParams,
    paginationOverideParams,
    filterParams,
    extraParams,
  ]
    .filter((p) => p !== "")
    .join("&");

  if (assembledParams) url = url + "?" + assembledParams;

  return url;
};

// Retrive Results From API, paginated or not
export const retrieveResults = (response) => {
  if (response.results) return response.results;
  return response;
};
