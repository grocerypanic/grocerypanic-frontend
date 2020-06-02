import debug from "./debug";
import { Paths } from "../configuration/backend";

export const RefreshCSRF = async () => {
  const [response, status] = await PerformRequest("GET", Paths.refreshCSRF);
  return response.token;
  // Where to store this token?
};

export const Backend = async (method, path, data = null) => {
  let [response, status] = await PerformRequest(method, path, data);
  if (status === 403 && response.error === "Refresh csrf and try again.") {
    // Automated Retry on CSRF Error
    const csrf = await RefreshCSRF();
    [response, status] = await PerformRequest(method, path, data, csrf);
    console.log(response, status);
  }
  return [response, status];
};

export const PerformRequest = (method, path, data = null, csrf = null) => {
  debug(`API ${method}:\n ${process.env.REACT_APP_PANIC_BACKEND}${path}`);
  if (data) debug(`Body:\n ${JSON.stringify(data)}`);
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
  if (csrf) options.headers["X-CSRFToken"] = csrf;

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
      debug(`API Response Data:\n`);
      debug(fetchResponseDecoded);
      return [fetchResponseDecoded, statusCode];
    })
    .catch(() => {
      return ["API Error.", 500];
    });
  return response;
};
