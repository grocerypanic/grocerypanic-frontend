import Backend from "./backend";
import match2xx from "./status";
import { Paths, Constants } from "../../configuration/backend";

const RefreshCSRF = async () => {
  const [response, status] = await Backend("GET", Paths.refreshCSRF);
  if (match2xx(status))
    localStorage.setItem(Constants.csrfLocalStorage, response.token);
};

export default RefreshCSRF;
