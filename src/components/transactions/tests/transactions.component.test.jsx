import React from "react";
import "jest-canvas-mock";
import { render, cleanup, waitFor } from "@testing-library/react";

import TransactionsReview from "../transactions.component";

import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";

import Strings from "../../../configuration/strings";
import { convertDatesToLocal } from "../../../providers/api/api.util";

global.Chart = jest.fn();
global.Chart.mockImplementation(() => {
  return {
    render: jest.fn(),
  };
});

const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

// Freeze Time
Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z"));

const mockItem = convertDatesToLocal({
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: "2020-06-15",
  next_expiry_quantity: 1,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf: 2,
  shelf_life: 5,
});

const mockTransactions = [
  { id: 1, item: 1, date: "2019-09-15", quantity: -5 },
  { id: 2, item: 1, date: "2019-10-15", quantity: 5 },
  { id: 3, item: 1, date: "2019-11-15", quantity: -5 },
  { id: 4, item: 1, date: "2019-12-15", quantity: 5 },
  { id: 5, item: 1, date: "2020-01-15", quantity: -5 },
  { id: 6, item: 1, date: "2020-02-15", quantity: 5 },
  { id: 7, item: 1, date: "2020-03-15", quantity: 5 },
  { id: 8, item: 1, date: "2020-06-05", quantity: -1 },
  { id: 9, item: 1, date: "2020-06-10", quantity: -3 },
  { id: 10, item: 1, date: "2020-06-15", quantity: -3 },
].map((o) => convertDatesToLocal(o));

describe("Setup Environment", () => {
  let utils;
  let current;

  beforeEach(() => {
    current = {
      title: "Some Title",
      item: { ...mockItem },
      transaction: false,
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

  describe("outside of a transaction", () => {
    beforeEach(() => {
      current.transaction = false;
      jest.clearAllMocks();
    });

    afterEach(cleanup);

    describe("with expired items in inventory", () => {
      beforeEach(() => {
        current.item.expired = 9;
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should render a warning about the expired items", () => {
        expect(utils.getByText(Strings.ItemStats.RecommendExpiredItems));
      });

      it("should render the graph", async (done) => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
        done();
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

      it("should render the graph", async (done) => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
        done();
      });
    });

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
        expect(utils.getByTestId("avgWeek").textContent).toBe("4.4");
      });

      it("should display weekly consumption data", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.ConsumptionAvgMonth}`)
        ).toBeTruthy();
        expect(utils.getByTestId("avgMonth").textContent).toBe("5.5");
      });

      it("should render the graph", async (done) => {
        await waitFor(() => expect(global.Chart).toBeCalledTimes(1));
        done();
      });
    });

    describe("with no transactions", () => {
      beforeEach(() => {
        current.tr = [];
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should display the insufficient data warning", () => {
        expect(
          utils.queryByText(`${Strings.ItemStats.NotEnoughData}`)
        ).toBeTruthy();
        expect(global.Chart).toBeCalledTimes(0);
      });
    });
  });
});
