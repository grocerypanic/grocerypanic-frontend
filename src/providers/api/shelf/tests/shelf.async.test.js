import ApiActions from "../../api.actions";
import ApiFunctions from "../../api.functions";

import { Backend } from "../../../util/requests";

jest.mock("../../../util/requests");

let responseCode;

describe("Check Each Async Function Handles Successful, and Unsuccessful API Actions", () => {
  describe("Sucessful API Response", () => {
    beforeEach(() => {
      responseCode = 201;
    });
  });

  describe("Unsucessful API Response", () => {
    beforeEach(() => {
      responseCode = 404;
    });
  });

  describe("Authentication Error Response", () => {
    beforeEach(() => {
      responseCode = 401;
    });
  });
});
