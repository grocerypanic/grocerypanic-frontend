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

const props = {
  title: "Some Title",
  item: { ...mockItem },
  transaction: false,
};

describe("Setup Environment", () => {
  let utils;
  let current;
  beforeEach(() => {
    current = { ...props };
  });

  describe("outside of a transaction", () => {
    beforeEach(() => {
      current.transaction = false;
      jest.clearAllMocks();
      utils = render(
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <TransactionsReview {...current} />
        </AnalyticsContext.Provider>
      );
    });

    afterEach(cleanup);

    it("should render with the correct message", () => {
      expect(
        utils.getByText(Strings.PlaceHolder.PlaceHolderMessage)
      ).toBeTruthy();
      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
    });
  });

  describe("inside of a transaction", () => {
    current.transaction = false;
    beforeEach(() => {
      jest.clearAllMocks();
      utils = render(
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <TransactionsReview {...current} />
        </AnalyticsContext.Provider>
      );
    });

    afterEach(cleanup);

    it("should render with the correct message", () => {
      expect(
        utils.getByText(Strings.PlaceHolder.PlaceHolderMessage)
      ).toBeTruthy();
      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(mockEvent).toHaveBeenCalledWith(AnalyticsActions.TestAction);
    });
  });

  describe("inside of a transaction", () => {});
});
