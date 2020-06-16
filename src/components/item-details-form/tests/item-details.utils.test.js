import { ShelfLifeConstants } from "../../../configuration/backend";

import {
  normalizeNameArray,
  normalizeName,
  normalizeId,
  normalizeShelfLifeName,
} from "../item-details.utils";

const objects = [
  { id: 1, name: "Niall" },
  { id: 2, name: "George" },
  { id: 3, name: "Frank" },
  { id: 4, name: "Suzy" },
  { id: 5, name: "Tiffanny" },
];

describe("setup for normalizeNameArrayTest", () => {
  beforeEach(() => {});

  it("valid input data, returns as expected", () => {
    expect(normalizeNameArray([1, 2], objects)).toStrictEqual([
      objects[0],
      objects[1],
    ]);
  });
  it("invalid input data, returns as expected", () => {
    expect(normalizeNameArray([9], objects)).toStrictEqual([]);
  });
});

describe("setup for normalizeName", () => {
  beforeEach(() => {});

  it("valid input data, returns as expected", () => {
    expect(normalizeName(1, objects)).toBe("Niall");
  });
  it("invalid input data, returns as expected", () => {
    expect(normalizeName(9, objects)).toBe("");
  });
});

describe("setup for normalizeId", () => {
  beforeEach(() => {});

  it("valid input data, returns as expected", () => {
    expect(normalizeId("Niall", objects)).toBe(1);
  });
  it("invalid input data, returns as expected", () => {
    expect(normalizeId("No Name", objects)).toBe("");
  });
});

describe("setup for normalizeShelfLifeName", () => {
  beforeEach(() => {});

  it("valid input data, returns as expected", () => {
    expect(normalizeShelfLifeName(ShelfLifeConstants[0].id)).toBe(
      ShelfLifeConstants[0].name
    );
  });
  it("invalid input data, returns as expected", () => {
    expect(normalizeShelfLifeName("33")).toBe(`${33} Days`);
  });
});
