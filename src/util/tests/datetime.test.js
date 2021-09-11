import moment from "moment";
import { expired, isWithinAMonth, within7Days } from "../datetime";

// Freeze Time
Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z"));

describe("Setup isWithinMonth", () => {
  it("should return false for items older than one month ", () => {
    const twomonthsago = moment().subtract(60, "days").startOf("day");
    expect(isWithinAMonth(twomonthsago)).toBe(false);
  });

  it("should return false for items in the future", () => {
    const twodaysfromnow = moment().add(2, "days").startOf("day");
    expect(isWithinAMonth(twodaysfromnow)).toBe(false);
  });

  it("should return true for items less than a week old", () => {
    const twoweeksago = moment().subtract(14, "days").startOf("day");
    expect(isWithinAMonth(twoweeksago)).toBe(true);
  });
});

describe("Setup within7Days", () => {
  it("should return false for items further in the future than one week ", () => {
    const ninedaysfromdnow = moment().add(9, "days").startOf("day");
    expect(within7Days(ninedaysfromdnow)).toBe(false);
  });

  it("should return false for items in the past", () => {
    const twodaysago = moment().subtract(2, "days").startOf("day");
    expect(within7Days(twodaysago)).toBe(false);
  });

  it("should return true for items less than a week old", () => {
    const fourdaysfromnow = moment().add(4, "days").startOf("day");
    expect(within7Days(fourdaysfromnow)).toBe(true);
  });
});

describe("Setup expired (in the future)", () => {
  it("should return false for items in the future", () => {
    const ninedaysfromdnow = moment().add(9, "days").startOf("day");
    expect(expired(ninedaysfromdnow)).toBe(false);
  });

  it("should return true for items in the past", () => {
    const twodaysago = moment().subtract(2, "days").startOf("day");
    expect(expired(twodaysago)).toBe(true);
  });
});
