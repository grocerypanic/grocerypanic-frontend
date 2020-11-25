import React from "react";
import "jest-canvas-mock";
import { render, cleanup, waitFor } from "@testing-library/react";
import moment from "moment";

import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import TransactionsReview from "../transactions.component";

import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import InitialState from "../../../providers/api/transaction/transaction.initial";
import ItemInitialState from "../../../providers/api/item/item.initial";

import Strings from "../../../configuration/strings";
import { generateConverter } from "../../../providers/api/api.util";
import { graph } from "../../../configuration/theme";
import { propCount } from "../../../test.fixtures/objectComparison";

global.Chart = jest.fn();
global.Chart.mockImplementation(() => {
  return {
    render: jest.fn(),
    destroy: jest.fn(),
  };
});
jest.mock("../../holding-pattern/holding-pattern.component");
HoldingPattern.mockImplementation(({ children }) => children);

const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

// Freeze Time
const OriginalDate = Date.now;
const mockDate = () =>
  (Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z")));

const convertDatesToLocal = generateConverter(InitialState.class);
const convertItemDatesToLocal = generateConverter(ItemInitialState.class);

const mockItem = convertItemDatesToLocal({
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: "2020-06-18",
  next_expiry_quantity: 1,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf: 2,
  shelf_life: 5,
});

const mockTransactions = [
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

describe("Setup Environment", () => {
  let utils;
  let current;

  beforeEach(() => {
    mockDate();
    current = {
      item: { ...mockItem },
      ready: false,
      tr: [...mockTransactions],
    };
  });

  const renderHelper = (config) => {
    return render(
      <AnalyticsContext.Provider value={mockAnalyticsSettings}>
        <TransactionsReview {...config} />
      </AnalyticsContext.Provider>
    );
  };

  describe("after transactions are fetched", () => {
    beforeEach(() => {
      current.ready = true;
      jest.clearAllMocks();
    });

    afterEach(cleanup);

    describe("with items in the inventory", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should display weekly consumption data", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.ConsumptionConsumedLastWeek}`)
        ).toBeTruthy();
        expect(utils.getByTestId("lastWeek").textContent).toBe("6");
      });

      it("should display monthly consumption data", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.ConsumptionConsumedLastMonth}`)
        ).toBeTruthy();
        expect(utils.getByTestId("lastMonth").textContent).toBe("7");
      });

      it("should display weekly consumption data", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.ConsumptionAvgWeek}`)
        ).toBeTruthy();
        expect(utils.getByTestId("avgWeek").textContent).toBe("4.5");
      });

      it("should display weekly consumption data", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.ConsumptionAvgMonth}`)
        ).toBeTruthy();
        expect(utils.getByTestId("avgMonth").textContent).toBe("6.8");
      });

      it("should call the holding pattern with expected arguments", async () => {
        await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 7);
        expect(call.condition).toBe(false);
        expect(call.color).toBe("secondary");
        expect(call.animation).toBe("grow");
        expect(call.height).toBe(graph.holdingPatternHeight);
        expect(call.scale).toBe(1);
        expect(call.divHeight).toBe(20);
        expect(call.children).toBeTruthy();
      });

      it("should render the graph", async () => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });

    describe("with no transactions", () => {
      beforeEach(() => {
        current.tr = [];
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should call the holding pattern with expected arguments", async () => {
        await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 7);
        expect(call.condition).toBe(false);
        expect(call.color).toBe("secondary");
        expect(call.animation).toBe("grow");
        expect(call.height).toBe(graph.holdingPatternHeight);
        expect(call.scale).toBe(1);
        expect(call.divHeight).toBe(20);
        expect(call.children).toBeTruthy();
      });

      it("should display the insufficient data warning", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.NotEnoughData}`)
        ).toBeTruthy();
        expect(global.Chart).toBeCalledTimes(0);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });

    describe("with expired items in inventory", () => {
      beforeEach(() => {
        current.item.expired = 9;
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should render a warning about the expired items", () => {
        expect(utils.getByText(Strings.ItemStats.RecommendExpiredItems));
      });

      it("should call the holding pattern with expected arguments", async () => {
        await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 7);
        expect(call.condition).toBe(false);
        expect(call.color).toBe("secondary");
        expect(call.animation).toBe("grow");
        expect(call.height).toBe(graph.holdingPatternHeight);
        expect(call.scale).toBe(1);
        expect(call.divHeight).toBe(20);
        expect(call.children).toBeTruthy();
      });

      it("should render the graph", async () => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });

    describe("with items expirying soon in inventory", () => {
      beforeEach(() => {
        utils = renderHelper(current);
      });

      it("should render a warning items expiring soon", () => {
        expect(
          utils.getByText(
            `${current.item.next_expiry_quantity} ${Strings.ItemStats.RecommendExpiringSoon}`
          )
        ).toBeTruthy();
      });

      it("should call the holding pattern with expected arguments", async () => {
        await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 7);
        expect(call.condition).toBe(false);
        expect(call.color).toBe("secondary");
        expect(call.animation).toBe("grow");
        expect(call.height).toBe(graph.holdingPatternHeight);
        expect(call.scale).toBe(1);
        expect(call.divHeight).toBe(20);
        expect(call.children).toBeTruthy();
      });

      it("should render the graph", async () => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });

    describe("with no items expirying soon in inventory, but an old next_expiry_date set", () => {
      beforeEach(() => {
        Date.now = OriginalDate;
        current.item.next_expiry_date = moment("2019-06-16");
        current.next_expiry_quantity = 0;
        mockDate();
        utils = renderHelper(current);
      });

      it("should not render a warning items expiring soon", () => {
        expect(
          utils.queryByText(
            `${current.item.next_expiry_quantity} ${Strings.ItemStats.RecommendExpiringSoon}`
          )
        ).toBeFalsy();
      });

      it("should call the holding pattern with expected arguments", async () => {
        await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 7);
        expect(call.condition).toBe(false);
        expect(call.color).toBe("secondary");
        expect(call.animation).toBe("grow");
        expect(call.height).toBe(graph.holdingPatternHeight);
        expect(call.scale).toBe(1);
        expect(call.divHeight).toBe(20);
        expect(call.children).toBeTruthy();
      });

      it("should render the graph", async () => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });
  });

  describe("before transactions are fetched", () => {
    beforeEach(() => {
      current.ready = false;
      jest.clearAllMocks();
    });

    describe("with items in the inventory", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should call the holding pattern with expected arguments", async () => {
        await waitFor(() => expect(HoldingPattern).toBeCalledTimes(1));
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 7);
        expect(call.condition).toBe(true);
        expect(call.color).toBe(graph.holdingPatternColor);
        expect(call.animation).toBe(graph.holdingPatternAnimation);
        expect(call.height).toBe(graph.holdingPatternHeight);
        expect(call.scale).toBe(graph.holdingPatternScale);
        expect(call.divHeight).toBe(graph.holdingPatternDivHeight);
        expect(call.children).toBeTruthy();
      });

      it("should not render the graph", async () => {
        expect(global.Chart).toBeCalledTimes(0);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });
  });
});
