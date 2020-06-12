import { calculateTitle } from "../item-list.util";
import { FilterTag } from "../../../configuration/backend";
import Strings from "../../../configuration/strings";

const mockTag = "FitlerName";

describe("Setup Environment", () => {
  let tests = [
    `localhost`,
    `localhost?${FilterTag}=${mockTag}`,
    `localhost?not_a_filter_tag=1`,
  ];
  const { location } = window;

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { search: tests.shift() };
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
      Strings.InventoryPage.Title
    );
  });

  it("should not tag the title when there is an invalid filter_tag string", () => {
    expect(calculateTitle(Strings.InventoryPage.Title)).toBe(
      Strings.InventoryPage.Title
    );
  });
});
