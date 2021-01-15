import Chart from "chart.js";
import "jest-canvas-mock";
import { render } from "@testing-library/react";
import { Constants } from "../../../configuration/backend";

import moment from "moment";

import { renderChart, generateChartData } from "../transaction.chart";

describe("Test renderGraph", () => {
  const stubbedTranslateFunction = () => {};
  const stubbedTransactions = [];
  const stubbedItem = { name: "Some Item" };

  beforeEach(() => {
    jest.clearAllMocks();
    render(<canvas id="consumptionChart"></canvas>);
  });

  it("should return a chart.js Chart object", () => {
    const return_value = renderChart(
      stubbedTranslateFunction,
      stubbedTransactions,
      stubbedItem
    );
    expect(return_value).toBeInstanceOf(Chart);
  });
});

describe("Test generateChartData", () => {
  const stubbedTransactions = [
    { id: 3, datetime: moment().add(-1, "days"), quantity: 1, item: 1 },
    { id: 4, datetime: moment().add(-1, "days"), quantity: 1, item: 1 },
    { id: 5, datetime: moment().add(-6, "days"), quantity: 2, item: 1 },
    { id: 6, datetime: moment().add(-6, "days"), quantity: 2, item: 1 },
    { id: 7, datetime: moment().add(-7, "days"), quantity: -2, item: 1 },
    { id: 22, datetime: moment().add(-22, "days"), quantity: -22, item: 1 },
  ];
  const stubbedItem = { id: 1, name: "Some Item", quantity: 200 };

  beforeEach(() => {});

  it("should generate an array of quantities with a fixed configured length of history (+ current quantity, + extra day)", () => {
    const [quantities] = generateChartData(stubbedTransactions, stubbedItem);
    expect(quantities.length).toBe(Constants.maximumTransactionHistory + 2);
  });

  it("should set the current quantity (0) to the item quantity", () => {
    const [quantities] = generateChartData(stubbedTransactions, stubbedItem);
    expect(quantities[0]).toBe(stubbedItem.quantity);
  });

  it("the array of changes should be offset by one, compared to the quantities, for a visual offset", () => {
    const [quantities, changes] = generateChartData(
      stubbedTransactions,
      stubbedItem
    );
    expect(quantities.length).toBe(changes.length + 1);
  });

  it("should cluster changes on the same day together as expected", () => {
    const [, changes] = generateChartData(stubbedTransactions, stubbedItem);
    expect(changes[1]).toBe(2);
    expect(changes[6]).toBe(4);
  });

  it("should not include changes older than the maximumTransactionHistory constant", () => {
    const [, changes] = generateChartData(stubbedTransactions, stubbedItem);
    expect(changes).not.toContain(-22);
  });

  it("the quantities should adjust with respect to the changes of the same index", () => {
    const [quantities, changes] = generateChartData(
      stubbedTransactions,
      stubbedItem
    );

    let last_quantity = quantities.shift();
    quantities.forEach((quantity, index) => {
      const change = changes[index];
      const next_quantity = last_quantity - change;
      expect(quantity).toBe(next_quantity);
      last_quantity = next_quantity;
    });
  });
});
