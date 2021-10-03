import { ShelfLifeConstants } from "../../../../configuration/backend";
import {
  normalizeNameArray,
  normalizeShelfName,
  normalizeShelfId,
  normalizeShelfLifeName,
  normalizeShelfLifeId,
} from "../item-details.form.utils.js";

const objects = [
  { id: 1, name: "Niall" },
  { id: 2, name: "George" },
  { id: 3, name: "Frank" },
  { id: 4, name: "Suzy" },
  { id: 5, name: "Tiffany" },
];

describe("normalizeNameArray", () => {
  beforeEach(() => {});

  it("should return the correct values with valid input data", () => {
    expect(normalizeNameArray([1, 2], objects)).toStrictEqual([
      objects[0],
      objects[1],
    ]);
  });

  it("should return an empty array with invalid input data", () => {
    expect(normalizeNameArray([9], objects)).toStrictEqual([]);
  });
});

describe("normalizeShelfName", () => {
  beforeEach(() => {});

  it("should return as expected with valid input data", () => {
    expect(normalizeShelfName(2, objects)).toBe("George");
  });

  it("should return null with out of range input data", () => {
    expect(normalizeShelfName(100, objects)).toBe(null);
  });

  it("should return null with no objects", () => {
    expect(normalizeShelfName(100, [])).toBe(null);
  });
});

describe("normalizeShelfId", () => {
  beforeEach(() => {});

  it("should return as expected with valid input data", () => {
    expect(normalizeShelfId("George", objects)).toBe(2);
  });

  it("should return null with an unknown name", () => {
    expect(normalizeShelfId("Unknown Name", objects)).toBe(null);
  });

  it("should return an empty string with no objects", () => {
    expect(normalizeShelfId("Niall", [])).toBe(null);
  });
});

describe("normalizeShelfLifeName", () => {
  beforeEach(() => {});

  it("should return the correct name with known input data", () => {
    expect(normalizeShelfLifeName(ShelfLifeConstants[0].id)).toBe(
      ShelfLifeConstants[0].name
    );
  });

  it("should return a custom shelf life string with an unknown shelf life input", () => {
    expect(normalizeShelfLifeName("33")).toBe(`${33} Days`);
  });
});

describe("normalizeShelfLifeId", () => {
  beforeEach(() => {});

  it("should return the correct id with known shelf life name data", () => {
    expect(
      normalizeShelfLifeId(ShelfLifeConstants[0].name, "default value")
    ).toBe(ShelfLifeConstants[0].id);
  });

  it("should the default value with an unknown shelf life name", () => {
    expect(normalizeShelfLifeId(120, 33)).toBe(33);
  });
});
