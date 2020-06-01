import debug from "./debug";
import { Paths } from "../configuration/backend";

const sleep = (m) => new Promise((r) => setTimeout(r, m));

export const RefreshCSRF = async () => {
  await PerformRequest("GET", Paths.refreshCSRF);
};

export const Backend = async (method, path, data = null) => {
  await sleep(500);
  const [response, status] = await PerformRequest(method, path, data);
  return [response, status];
};

export const PerformRequest = (method, path, data = null) => {
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

  const response = fetch(
    `${process.env.REACT_APP_PANIC_BACKEND}${path}`,
    options
  )
    .then(async (fetchResponse) => {
      const contentType = fetchResponse.headers.get("content-type");
      statusCode = fetchResponse.status;
      if (contentType === null) return new Promise(() => null);
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
  console.log(response);
  return response;
};
