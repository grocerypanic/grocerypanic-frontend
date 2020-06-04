import match2xx from "../status";

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
