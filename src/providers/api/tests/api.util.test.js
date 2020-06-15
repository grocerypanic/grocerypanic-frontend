import { apiResultCompare } from "../api.util";

const objects = [
  { id: 1, name: "Cash Register" },
  { id: 2, name: "Sink" },
];

describe("Setup Environment", () => {
  beforeEach(() => {});

  it("should handle greater than", () => {
    expect(apiResultCompare(objects[0], objects[1])).toBe(-1);
  });

  it("should handle less than", () => {
    expect(apiResultCompare(objects[1], objects[0])).toBe(1);
  });

  it("should handle equal to ", () => {
    expect(apiResultCompare(objects[1], objects[1])).toBe(0);
  });
});
