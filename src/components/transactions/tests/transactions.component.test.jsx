import React from "react";
import { render, cleanup } from "@testing-library/react";

import TransactionsReview from "../transactions.component";

import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";

import Strings from "../../../configuration/strings";

const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

const mockItem = {
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: "2020-06-15",
  next_expiry_quantity: 0,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf: 2,
  shelf_life: 25,
};

const mockTransactions = [
  { id: 1, item: 1, date: "2019-09-15", quantity: 5 },
  { id: 2, item: 1, date: "2019-10-15", quantity: 5 },
  { id: 3, item: 1, date: "2019-11-15", quantity: 5 },
  { id: 4, item: 1, date: "2019-12-15", quantity: 5 },
  { id: 5, item: 1, date: "2020-01-15", quantity: 5 },
  { id: 6, item: 1, date: "2020-02-15", quantity: 5 },
  { id: 7, item: 1, date: "2020-03-15", quantity: 5 },
  { id: 8, item: 1, date: "2020-04-15", quantity: 5 },
  { id: 9, item: 1, date: "2020-05-15", quantity: 5 },
  { id: 10, item: 1, date: "2020-06-15", quantity: 5 },
];

const props = {
  title: "Some Title",
  item: { ...mockItem },
  transaction: false,
  tr: [...mockTransactions],
};

describe("Setup Environment", () => {
  let utils;
  let current;
  beforeEach(() => {
    current = { ...props };
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
        current.expired = 9;
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should render a warning about the expired items", () => {
        expect(utils.getByText(Strings.ItemStats.Recommend.ExpiredItems));
      });
    });

    describe("with items expirying soon in inventory", () => {
      beforeEach(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        current.next_expiry_date = yesterday.toISOString().split("T")[0];
        jest.clearAllMocks();
      });
    });

    describe("with few transactions", () => {
      beforeEach(() => {
        current.tr = mockTransactions.slice(-3, 2);
      });
    });
  });
});
