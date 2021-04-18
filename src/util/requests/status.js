import { Constants } from "../../configuration/backend";

export const match2xx = (statusCode) => {
  return statusCode.toString()[0] === "2";
};

export const match400duplicate = (statusCode, apiResponse) => {
  if (statusCode !== 400) return false;
  for (const duplicateError of Constants.duplicateObjectApiErrors) {
    for (const apiErrors of Object.values(apiResponse)) {
      if (apiErrors === duplicateError) return true;
      if (apiErrors.includes(duplicateError)) return true;
    }
  }
  return false;
};
