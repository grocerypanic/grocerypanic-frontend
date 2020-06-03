import debug from "./debug";
import { Paths, Constants, SafeMethods } from "../configuration/backend";

export const RefreshCSRF = async () => {
  const [response, status] = await PerformRequest("GET", Paths.refreshCSRF);
  if (status === 200)
    localStorage.setItem(Constants.csrfLocalStorage, response.token);
};

export const Backend = async (method, path, data = null) => {
  let [response, status] = await PerformRequest(method, path, data);
  if (status === 403 && response.error === Constants.csrfErrorMessage) {
    // Automated Retry on CSRF Error
    await RefreshCSRF();
    [response, status] = await PerformRequest(method, path, data);
  }
  return [response, status];
};

export const PerformRequest = (method, path, data = null) => {
  debug(`API ${method}:\n ${process.env.REACT_APP_PANIC_BACKEND}${path}`);
  if (data) debug(`Body:\n ${JSON.stringify(data)}`);
  let csrf;
  let statusCode;

  const options = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (data) options.body = JSON.stringify(data);
  if (!SafeMethods.includes(method)) {
    csrf = localStorage.getItem(Constants.csrfLocalStorage);
    if (csrf) options.headers[Constants.csrfHeaderName] = csrf;
  }

  const response = fetch(
    `${process.env.REACT_APP_PANIC_BACKEND}${path}`,
    options
  )
    .then(async (fetchResponse) => {
      const contentType = fetchResponse.headers.get("content-type");
      statusCode = fetchResponse.status;
      if (contentType === null) return null;
      if (contentType.startsWith("application/json"))
        return await fetchResponse.json();
      return fetchResponse.text();
    })
    .then((fetchResponseDecoded) => {
      debug(`API Response Status Code:\n ${statusCode}`);
      if (fetchResponseDecoded) {
        debug(`API Response Data:\n`);
        debug(fetchResponseDecoded);
      }
      return [fetchResponseDecoded, statusCode];
    })
    .catch(() => {
      return [Constants.genericAPIError, 500];
    });
  return response;
};
