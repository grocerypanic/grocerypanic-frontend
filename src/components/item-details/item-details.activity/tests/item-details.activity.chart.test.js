import { render } from "@testing-library/react";
import { Chart } from "chart.js";
import ResizeObserver from "resize-observer-polyfill";
import "jest-canvas-mock";
import { Constants } from "../../../../configuration/backend";
import {
  renderChart,
  generateChartData,
  nullFunction,
} from "../item-details.activity.chart";

const mockItem = { id: 1, name: "Some Item", quantity: 200 };
const mockTransactions = [
  {
    date: "2020-06-18",
    change: 0,
  },
  {
    date: "2020-06-17",
    change: -1,
  },
  {
    date: "2020-06-16",
    change: -2,
  },
  {
    date: "2020-06-15",
    change: -3,
  },
  {
    date: "2020-06-14",
    change: 1,
  },
  {
    date: "2020-06-13",
    change: 2,
  },
  {
    date: "2020-06-12",
    change: -5,
  },
  {
    date: "2021-06-11",
    change: 0,
  },
  {
    date: "2021-06-10",
    change: 0,
  },
  {
    date: "2021-06-09",
    change: 0,
  },
  {
    date: "2020-06-08",
    change: 0,
  },
  {
    date: "2020-06-07",
    change: 0,
  },
  {
    date: "2020-06-06",
    change: 0,
  },
  {
    date: "2020-06-05",
    change: 0,
  },
];

describe("Test renderGraph", () => {
  const stubbedTranslateFunction = () => {};
  const originalResizeObserver = global.ResizeObserver;

  beforeAll(() => {
    global.ResizeObserver = ResizeObserver;
  });

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    render(<canvas id="consumptionChart"></canvas>);
  });

  it("should return a chart.js Chart object", () => {
    const return_value = renderChart(
      stubbedTranslateFunction,
      mockTransactions,
      mockItem
    );
    expect(return_value).toBeInstanceOf(Chart);
  });
});

describe("Test generateChartData", () => {
  let result;

  describe("With item data", () => {
    beforeEach(() => {
      result = generateChartData(mockTransactions, mockItem);
    });

    it("should generate an array of quantities with a fixed configured length of history (+ current quantity)", () => {
      const [quantities] = result;
      expect(quantities.length).toBe(Constants.maximumTransactionHistory + 1);
    });

    it("should set the current quantity (0) to the item quantity", () => {
      const [quantities] = result;
      expect(quantities[0]).toBe(mockItem.quantity);
    });

    it("the array of changes should be offset by one, compared to the quantities, for a visual offset", () => {
      const [quantities, changes] = result;
      expect(quantities.length).toBe(changes.length + 1);
    });

    it("the quantities should adjust with respect to the changes of the same index", () => {
      const [quantities, changes] = result;

      let last_quantity = quantities.shift();
      quantities.forEach((quantity, index) => {
        const change = changes[index];
        const next_quantity = last_quantity - change;
        expect(quantity).toBe(next_quantity);
        last_quantity = next_quantity;
      });
    });
  });
});

describe("Test the label blanking nullFunction", () => {
  it("should return null", () => {
    expect(nullFunction()).toBeNull();
  });
});
