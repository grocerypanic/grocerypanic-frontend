import moment from "moment";

import {
  consumedWithinThisWeek,
  consumedWithinThisMonth,
  consumedInLastWeek,
  consumedInLastMonth,
} from "../consumption";

// Freeze Time
Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z"));

const mockTransactions = [
  { id: 0, item: 1, datetime: moment("2019-09-14").utc(), quantity: -5 },
  { id: 1, item: 1, datetime: moment("2019-09-15").utc(), quantity: -5 },
  { id: 2, item: 1, datetime: moment("2019-10-15").utc(), quantity: 5 },
  { id: 3, item: 1, datetime: moment("2019-11-15").utc(), quantity: -5 },
  { id: 4, item: 1, datetime: moment("2019-12-15").utc(), quantity: 5 },
  { id: 5, item: 1, datetime: moment("2020-01-15").utc(), quantity: -5 },
  { id: 6, item: 1, datetime: moment("2020-01-16").utc(), quantity: -5 },
  { id: 7, item: 1, datetime: moment("2020-02-15").utc(), quantity: 5 },
  { id: 8, item: 1, datetime: moment("2020-05-15").utc(), quantity: -5 },
  { id: 9, item: 1, datetime: moment("2020-06-05").utc(), quantity: -1 },
  { id: 10, item: 1, datetime: moment("2020-06-10").utc(), quantity: -3 },
  { id: 11, item: 1, datetime: moment("2020-06-16").utc(), quantity: -3 },
];

describe("Setup consumedWithinThisWeek", () => {
  it("should parse the list of transactions, and return the total consumed in this current week", () => {
    expect(consumedWithinThisWeek(mockTransactions)).toBe(
      Math.abs(mockTransactions[11].quantity)
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(consumedWithinThisWeek([])).toBe(0);
  });
});

describe("Setup consumedWithinThisMonth", () => {
  it("should parse the list of transactions, and return the total consumed in this current month", () => {
    expect(consumedWithinThisMonth(mockTransactions)).toBe(
      Math.abs(
        mockTransactions[9].quantity +
          mockTransactions[10].quantity +
          mockTransactions[11].quantity
      )
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(consumedInLastMonth([])).toBe(0);
  });
});

describe("Setup consumedWithinLastWeek", () => {
  it("should parse the list of transactions, and return the total consumed in the last week", () => {
    expect(consumedInLastWeek(mockTransactions)).toBe(
      Math.abs(mockTransactions[10].quantity + mockTransactions[9].quantity)
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(consumedInLastWeek([])).toBe(0);
  });
});

describe("Setup consumedWithinLastMonth", () => {
  it("should parse the list of transactions, and return the total consumed in the last month", () => {
    expect(consumedInLastMonth(mockTransactions)).toBe(
      Math.abs(mockTransactions[7].quantity)
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(consumedInLastMonth([])).toBe(0);
  });
});
