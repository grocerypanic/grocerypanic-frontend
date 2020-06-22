import { apiResultCompare } from "../api.util";

const withNames = [
  { id: 1, name: "Cash Register" },
  { id: 2, name: "Sink" },
];

const withIDs = [{ id: 1 }, { id: 2 }];

describe("Setup Environment", () => {
  beforeEach(() => {});

  it("should handle greater than with name", () => {
    expect(apiResultCompare(withNames[0], withNames[1])).toBe(-1);
  });

  it("should handle greater than with id's only", () => {
    expect(apiResultCompare(withIDs[0], withIDs[1])).toBe(-1);
  });

  it("should handle less than with names", () => {
    expect(apiResultCompare(withNames[1], withNames[0])).toBe(1);
  });

  it("should handle less than with id's only", () => {
    expect(apiResultCompare(withIDs[0], withIDs[1])).toBe(-1);
  });

  it("should handle equal to with names", () => {
    expect(apiResultCompare(withNames[1], withNames[1])).toBe(0);
  });

  it("should handle equal to with id's only", () => {
    expect(apiResultCompare(withIDs[0], withIDs[1])).toBe(-1);
  });
});
