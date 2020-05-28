import debug from "./debug";

export const Post = (path, data = {}) => {
  debug(`API POST:\n ${process.env.REACT_APP_PANIC_BACKEND}${path}`);
  debug(`Content:\n ${JSON.stringify(data)}`);
  let statusCode;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const response = fetch(`${process.env.REACT_APP_PANIC_BACKEND}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })
    .then((fetchResponse) => {
      const contentType = fetchResponse.headers.get("content-type");
      statusCode = fetchResponse.status;
      if (contentType === null) return new Promise(() => null);
      if (contentType.startsWith("application/json"))
        return fetchResponse.json();
      return fetchResponse.text();
    })
    .then((fetchResponseDecoded) => {
      debug(`API Response Status Code:\n ${statusCode}`);
      return [fetchResponseDecoded, statusCode];
    })
    .catch(() => {
      return ["API Error.", 500];
    });
  return response;
};
