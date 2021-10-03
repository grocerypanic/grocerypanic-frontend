import { defaultItem } from "../item-details.create/item-details.create.container";
import { calculateDefaults } from "../item-details.utils";

let params;
let shelf;
let store;

describe("Setup Test", () => {
  describe("When given an empty query string", () => {
    beforeEach(() => {
      params = new URLSearchParams({});
      store = [{ id: 21, name: "Metro" }];
      shelf = [
        { id: 22, name: "Fridge" },
        { id: 23, name: "Pantry" },
      ];
    });

    it("should return the correct default values", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        shelf: shelf[0].id,
      });
    });
  });

  describe("When given a valid query string with a invalid store specified", () => {
    const configured_store = 99;

    beforeEach(() => {
      params = new URLSearchParams({ preferred_stores: configured_store });
      store = [{ id: 21, name: "Metro" }];
      shelf = [
        { id: 22, name: "Fridge" },
        { id: 23, name: "Pantry" },
      ];
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        shelf: shelf[0].id,
      });
    });
  });

  describe("When given a valid query string with a valid store specified", () => {
    const configured_store = 21;

    beforeEach(() => {
      params = new URLSearchParams({ preferred_stores: configured_store });
      store = [{ id: 21, name: "Metro" }];
      shelf = [
        { id: 22, name: "Fridge" },
        { id: 23, name: "Pantry" },
      ];
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        preferred_stores: [configured_store],
        shelf: shelf[0].id,
      });
    });
  });

  describe("When given a valid query string with a invalid shelf specified", () => {
    const configured_shelf = 99;

    beforeEach(() => {
      params = new URLSearchParams({ shelf: configured_shelf });
      store = [{ id: 21, name: "Metro" }];
      shelf = [
        { id: 22, name: "Fridge" },
        { id: 23, name: "Pantry" },
      ];
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        shelf: shelf[0].id,
      });
    });
  });

  describe("When given a valid query string with a valid shelf specified", () => {
    const configured_shelf = 23;

    beforeEach(() => {
      params = new URLSearchParams({ shelf: configured_shelf });
      store = [{ id: 21, name: "Metro" }];
      shelf = [
        { id: 22, name: "Fridge" },
        { id: 23, name: "Pantry" },
      ];
    });

    it("should return the correct default values, with the specified store", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        shelf: configured_shelf,
      });
    });
  });

  describe("When given a valid query string with nothing specified", () => {
    beforeEach(() => {
      params = new URLSearchParams({ invalid: 22 });
      store = [{ id: 21, name: "Metro" }];
      shelf = [
        { id: 22, name: "Fridge" },
        { id: 23, name: "Pantry" },
      ];
    });

    it("should return the correct default values", () => {
      expect(
        calculateDefaults(params, defaultItem, shelf, store)
      ).toStrictEqual({
        ...defaultItem,
        shelf: shelf[0].id,
      });
    });
  });
});
