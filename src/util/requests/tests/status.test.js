import { Constants } from "../../../configuration/backend";
import { match2xx, match400duplicate } from "../status";

describe("setup the environment for testing match2xx", () => {
  beforeEach(() => {});

  it("should match a 200", () => {
    expect(match2xx(200)).toBeTruthy();
  });

  it("should match a 201", () => {
    expect(match2xx(201)).toBeTruthy();
  });

  it("should match a 204", () => {
    expect(match2xx(204)).toBeTruthy();
  });

  it("should not match a 301", () => {
    expect(match2xx(301)).toBeFalsy();
  });

  it("should not match a 401", () => {
    expect(match2xx(401)).toBeFalsy();
  });

  it("should not match a 501", () => {
    expect(match2xx(501)).toBeFalsy();
  });
});

describe("setup the environment for testing match400duplicate", () => {
  let statusCode;
  let apiResponse;
  describe("given a duplicate error list from the api", () => {
    beforeEach(() => {
      apiResponse = { error: [Constants.duplicateObjectApiErrors[0]] };
    });
    describe("given a 400 status code", () => {
      beforeEach(() => {
        statusCode = 400;
      });
      it("should match this condition and return true", () => {
        expect(match400duplicate(statusCode, apiResponse)).toBe(true);
      });
    });

    describe("given a 200 status code", () => {
      beforeEach(() => {
        statusCode = 200;
      });
      it("should not match this condition and return false", () => {
        expect(match400duplicate(statusCode, apiResponse)).toBe(false);
      });
    });
  });

  describe("given a duplicate error message from the api", () => {
    beforeEach(() => {
      apiResponse = { error: Constants.duplicateObjectApiErrors[0] };
    });
    describe("given a 400 status code", () => {
      beforeEach(() => {
        statusCode = 400;
      });
      it("should match this condition and return true", () => {
        expect(match400duplicate(statusCode, apiResponse)).toBe(true);
      });
    });

    describe("given a 200 status code", () => {
      beforeEach(() => {
        statusCode = 200;
      });
      it("should not match this condition and return false", () => {
        expect(match400duplicate(statusCode, apiResponse)).toBe(false);
      });
    });
  });

  describe("given a non matching message from the api", () => {
    beforeEach(() => {
      apiResponse = {
        happy: "I'm happy, but looking.",
      };
    });
    describe("given a 400 status code", () => {
      beforeEach(() => {
        statusCode = 400;
      });
      it("should not match this condition and return false", () => {
        expect(match400duplicate(statusCode, apiResponse)).toBe(false);
      });
    });

    describe("given a 200 status code", () => {
      beforeEach(() => {
        statusCode = 200;
      });
      it("should not match this condition and return false", () => {
        expect(match400duplicate(statusCode, apiResponse)).toBe(false);
      });
    });
  });
});
