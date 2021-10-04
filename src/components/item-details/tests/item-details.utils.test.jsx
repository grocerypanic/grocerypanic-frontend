import { defaultItem } from "../item-details.create/item-details.create.container";
import { calculateDefaults } from "../item-details.utils";

let params;
let shelf;
let store;

describe("calculateDefaults", () => {
  let configured_store;
  let configured_shelf;
  const stores = [{ id: 21, name: "Metro" }];
  const shelves = [
    { id: 22, name: "Fridge" },
    { id: 23, name: "Pantry" },
  ];

  describe("When given an EMPTY query string", () => {
    beforeEach(() => {
      params = new URLSearchParams({});
    });

    it("should return the correct default values", () => {
      expect(
        calculateDefaults(params, defaultItem, shelves, stores)
      ).toStrictEqual({
        ...defaultItem,
        shelf: null,
      });
    });
  });

  describe("When given a valid query string with an INVALID store specified", () => {
    beforeEach(() => {
      configured_store = 99;
      params = new URLSearchParams({ preferred_stores: configured_store });
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelves, stores)
      ).toStrictEqual({
        ...defaultItem,
        shelf: null,
      });
    });
  });

  describe("When given a valid query string with a VALID store specified", () => {
    beforeEach(() => {
      configured_store = 21;
      params = new URLSearchParams({ preferred_stores: configured_store });
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelves, stores)
      ).toStrictEqual({
        ...defaultItem,
        preferred_stores: [configured_store],
        shelf: null,
      });
    });
  });

  describe("When given a valid query string with an INVALID shelf specified", () => {
    beforeEach(() => {
      configured_shelf = 99;
      params = new URLSearchParams({ shelf: configured_shelf });
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelves, stores)
      ).toStrictEqual({
        ...defaultItem,
        shelf: null,
      });
    });
  });

  describe("When given a valid query string with a VALID shelf specified", () => {
    beforeEach(() => {
      configured_shelf = 23;
      params = new URLSearchParams({ shelf: configured_shelf });
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelves, stores)
      ).toStrictEqual({
        ...defaultItem,
        shelf: configured_shelf,
      });
    });
  });

  describe("When given a valid query string with NOTHING specified", () => {
    beforeEach(() => {
      params = new URLSearchParams({ invalid: 22 });
    });

    it("should return the correct default values", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        shelf: null,
      });
    });
  });
});
