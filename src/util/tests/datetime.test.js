import moment from "moment";

import { expired, isWithinAWeek, isWithinAMonth, nextWeek } from "../datetime";

// Freeze Time
Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z"));

describe("Setup isWithinWeek", () => {
  it("should return false for items older than one week ", () => {
    const ninedaysago = moment().subtract(9, "days").startOf("day");
    expect(isWithinAWeek(ninedaysago)).toBe(false);
  });

  it("should return false for items in the future", () => {
    const twodaysfromnow = moment().add(2, "days").startOf("day");
    expect(isWithinAWeek(twodaysfromnow)).toBe(false);
  });

  it("should return true for items less than a week old", () => {
    const fourdaysago = moment().subtract(4, "days").startOf("day");
    expect(isWithinAWeek(fourdaysago)).toBe(true);
  });
});

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

describe("Setup nextWeek", () => {
  it("should return false for items further in the future than one week ", () => {
    const ninedaysfromdnow = moment().add(9, "days").startOf("day");
    expect(nextWeek(ninedaysfromdnow)).toBe(false);
  });

  it("should return false for items in the past", () => {
    const twodaysago = moment().subtract(2, "days").startOf("day");
    expect(nextWeek(twodaysago)).toBe(false);
  });

  it("should return true for items less than a week old", () => {
    const fourdaysfromnow = moment().add(4, "days").startOf("day");
    expect(nextWeek(fourdaysfromnow)).toBe(true);
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
