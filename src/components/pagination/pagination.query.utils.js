import { Constants } from "../../configuration/backend";

export const hasQueryString = (url) => {
  return url.indexOf("?") > -1;
};

export const hasPaginationParam = (url) => {
  if (!hasQueryString(url)) return false;
  const queryParams = new URLSearchParams("?" + url.split("?")[1]);
  if (queryParams.get(Constants.pageLookupParam)) return true;
  return false;
};

export const getQueryParams = (url) => {
  if (!hasQueryString(url)) return new URLSearchParams({});
  return new URLSearchParams("?" + url.split("?")[1]);
};

export const getOtherQueryParams = (url) => {
  if (!hasQueryString(url)) return new URLSearchParams({});
  const params = getQueryParams(url);
  if (params.get(Constants.pageLookupParam))
    params.delete(Constants.pageLookupParam);
  return params;
};

export const rewriteUrlWithPagination = (apiUrl) => {
  // Only Attempt This If The Browser Seems to Support It
  if (!window.history.pushState) return;
  if (hasPaginationParam(apiUrl)) {
    let seperator = "?";
    const apiQueryParams = getQueryParams(apiUrl);
    const params = getOtherQueryParams(window.location.search);
    params.set(
      Constants.pageLookupParam,
      apiQueryParams.get(Constants.pageLookupParam)
    );
    const url =
      window.location.pathname +
      seperator +
      new URLSearchParams(params).toString();
    window.history.pushState(null, document.title, url);
  } else {
    if (hasQueryString(window.location.search)) {
      const params = getOtherQueryParams(window.location.search);
      const param_string = new URLSearchParams(params).toString();
      let url = window.location.pathname;
      if (param_string !== "")
        url = url + "?" + new URLSearchParams(params).toString();
      window.history.pushState(null, document.title, url);
    }
  }
};
