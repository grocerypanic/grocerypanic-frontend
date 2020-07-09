import { Constants } from "../../configuration/backend";

export const match2xx = (statusCode) => {
  return statusCode.toString()[0] === "2";
};

export const match400duplicate = (statusCode, apiResponse) => {
  if (statusCode !== 400) return false;
  if (
    JSON.stringify(apiResponse) !==
    JSON.stringify(Constants.duplicateObjectApiError)
  )
    return false;
  return true;
};
