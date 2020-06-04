import Backend from "./requests/backend";
import RefreshCSRF from "./requests/csrf";

import { Constants } from "../configuration/backend";

const Request = async (method, path, data = null) => {
  let [response, status] = await Backend(method, path, data);
  if (status === 403 && response.error === Constants.csrfErrorMessage) {
    // Automated Retry on CSRF Error
    await RefreshCSRF();
    [response, status] = await Backend(method, path, data);
  }
  return [response, status];
};

export default Request;
