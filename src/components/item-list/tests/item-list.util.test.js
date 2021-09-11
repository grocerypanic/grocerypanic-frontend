import { FilterTag } from "../../../configuration/backend";
import Strings from "../../../configuration/strings";
import { calculateTitle } from "../item-list.util";

const mockTag = "FitlerName";

describe("Setup Environment", () => {
  let tests = [``, `?${FilterTag}=${mockTag}`, `?not_a_filter_tag=1`];
  const { location } = window;

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    const query_string = tests.shift();
    window.location = {
      search: query_string,
    };
  });

  afterAll(() => {
    window.location = location;
  });

  it("should return the default title without modifications", () => {
    expect(calculateTitle(Strings.InventoryPage.Title)).toBe(
      Strings.InventoryPage.Title
    );
  });

  it("should tag the title when there is a filter_tag string", () => {
    expect(calculateTitle(Strings.InventoryPage.Title)).toBe(
      Strings.InventoryPage.Title.replace(/\(.*\)/gi, `(${mockTag})`)
    );
  });

  it("should not tag the title when there is an invalid filter_tag string", () => {
    expect(calculateTitle(Strings.InventoryPage.Title)).toBe(
      Strings.InventoryPage.Title
    );
  });
});
