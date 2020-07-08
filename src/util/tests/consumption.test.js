import {
  consumedWithinLastWeek,
  consumedWithinLastMonth,
  averageWeeklyConsumption,
  averageMonthlyConsumption,
} from "../consumption";

import InitialState from "../../providers/api/transaction/transaction.initial";
import { generateConverter } from "../../providers/api/api.util";

// Freeze Time
Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z"));

const convertDatesToLocal = generateConverter(InitialState.class);

const mockTransactions = [
  { id: 0, item: 1, datetime: "2019-09-14", quantity: -5 },
  { id: 1, item: 1, datetime: "2019-09-15", quantity: -5 },
  { id: 2, item: 1, datetime: "2019-10-15", quantity: 5 },
  { id: 3, item: 1, datetime: "2019-11-15", quantity: -5 },
  { id: 4, item: 1, datetime: "2019-12-15", quantity: 5 },
  { id: 5, item: 1, datetime: "2020-01-15", quantity: -5 },
  { id: 6, item: 1, datetime: "2020-01-16", quantity: -5 },
  { id: 7, item: 1, datetime: "2020-02-15", quantity: 5 },
  { id: 8, item: 1, datetime: "2020-03-15", quantity: 5 },
  { id: 9, item: 1, datetime: "2020-06-05", quantity: -1 },
  { id: 10, item: 1, datetime: "2020-06-10", quantity: -3 },
  { id: 11, item: 1, datetime: "2020-06-15", quantity: -3 },
].map((o) => convertDatesToLocal(o));

const consumption_by_week = {
  "20203": -10,
  "201937": -10,
  "201946": -5,
  "202023": -1,
  "202024": -3,
  "202025": -3,
};

const consumption_by_month = {
  "20198": -10,
  "20200": -10,
  "20205": -7,
  "201910": -5,
};

const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

describe("Setup consumedWithinLastWeek", () => {
  it("should parse the list of transactions, and return the total consumed in the last week", () => {
    expect(consumedWithinLastWeek(mockTransactions)).toBe(
      Math.abs(mockTransactions[10].quantity + mockTransactions[11].quantity)
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(consumedWithinLastWeek([])).toBe(0);
  });
});

describe("Setup consumedWithinLastMonth", () => {
  it("should parse the list of transactions, and return the total consumed in the last month", () => {
    expect(consumedWithinLastMonth(mockTransactions)).toBe(
      Math.abs(
        mockTransactions[9].quantity +
          mockTransactions[10].quantity +
          mockTransactions[11].quantity
      )
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(consumedWithinLastMonth([])).toBe(0);
  });
});

describe("Setup averageWeeklyConsumption", () => {
  it("should parse the list of transactions, and return the average consumed in the last week", () => {
    expect(averageWeeklyConsumption(mockTransactions)).toBe(
      Math.abs(
        arrSum(Object.values(consumption_by_week)) /
          Object.keys(consumption_by_week).length
      ).toFixed(1)
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(averageWeeklyConsumption([])).toBe(0);
  });
});

describe("Setup averageMonthlyConsumption", () => {
  it("should parse the list of transactions, and return the average consumed in the last month", () => {
    expect(averageMonthlyConsumption(mockTransactions)).toBe(
      Math.abs(
        arrSum(Object.values(consumption_by_month)) /
          Object.keys(consumption_by_month).length
      ).toFixed(1)
    );
  });

  it("should parse an empty list of transactions and return 0", () => {
    expect(averageMonthlyConsumption([])).toBe(0);
  });
});
