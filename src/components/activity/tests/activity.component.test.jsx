import "jest-canvas-mock";
import { render, cleanup, waitFor } from "@testing-library/react";
import moment from "moment";
import React from "react";
import Strings from "../../../configuration/strings";
import { graph } from "../../../configuration/theme";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import { propCount } from "../../../test.fixtures/objectComparison";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import { renderChart } from "../activity.chart";
import ActivityReport, { nullReport } from "../activity.component";

jest.mock("../activity.chart");
jest.mock("../../holding-pattern/holding-pattern.component");

const mockDestroy = jest.fn();
const mockEvent = jest.fn();
const mockAnalyticsSettings = { event: mockEvent, initialized: true };

HoldingPattern.mockImplementation(({ children }) => children);
renderChart.mockImplementation(() => jest.fn());

// Freeze Time
const OriginalDate = Date.now;
const mockDate = () =>
  (Date.now = jest.fn(() => new Date("2020-06-16T11:01:58.135Z")));

const mockItem = {
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: moment("2020-06-18").utc(),
  next_expiry_quantity: 1,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf: 2,
  shelf_life: 5,
};

const mockActivityReport = {
  id: 1,
  activity_first: moment("2020-03-01").utc(),
  usage_total: 1,
  usage_avg_week: 0.17,
  usage_avg_month: 0.5,
  recent_activity: {
    user_timezone: "UTC",
    usage_current_week: 0,
    usage_current_month: 0,
    activity_last_two_weeks: [
      {
        date: "2020-06-18",
        change: 0,
      },
      {
        date: "2020-06-17",
        change: 0,
      },
      {
        date: "2020-06-16",
        change: 0,
      },
      {
        date: "2020-06-15",
        change: 0,
      },
      {
        date: "2020-06-14",
        change: 0,
      },
      {
        date: "2020-06-13",
        change: 0,
      },
      {
        date: "2020-06-12",
        change: 0,
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
    ],
  },
};

describe("Setup Environment", () => {
  let utils;
  let current;

  beforeEach(() => {
    mockDate();
    current = {
      item: { ...mockItem },
      activity_report: { ...mockActivityReport },
    };
  });

  afterEach(() => {
    Date.now = OriginalDate;
  });

  const renderHelper = (config) => {
    return render(
      <AnalyticsContext.Provider value={mockAnalyticsSettings}>
        <ActivityReport {...config} />
      </AnalyticsContext.Provider>
    );
  };

  describe("after report is fetched", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderChart.mockReturnValue({ destroy: mockDestroy });
    });

    afterEach(cleanup);

    describe("with a valid activity report", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("should display average weekly consumption data", () => {
        expect(
          utils.queryByText(
            `${Strings.ItemActivity.ConsumptionConsumedAvgWeek}`
          )
        ).toBeTruthy();
        expect(utils.getByTestId("avgWeek").textContent).toBe(
          String(mockActivityReport.usage_avg_week)
        );
      });

      it("should display average monthly consumption data", () => {
        expect(
          utils.queryByText(
            `${Strings.ItemActivity.ConsumptionConsumedAvgMonth}`
          )
        ).toBeTruthy();
        expect(utils.getByTestId("avgMonth").textContent).toBe(
          String(mockActivityReport.usage_avg_month)
        );
      });

      it("should display current week's consumption data", () => {
        expect(
          utils.queryByText(
            `${Strings.ItemActivity.ConsumptionConsumedThisWeek}`
          )
        ).toBeTruthy();
        expect(utils.getByTestId("thisWeek").textContent).toBe(
          String(mockActivityReport.recent_activity.usage_current_week)
        );
      });

      it("should display current month's consumption data", () => {
        expect(
          utils.queryByText(
            `${Strings.ItemActivity.ConsumptionConsumedThisMonth}`
          )
        ).toBeTruthy();
        expect(utils.getByTestId("thisMonth").textContent).toBe(
          String(mockActivityReport.recent_activity.usage_current_month)
        );
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
        await waitFor(() => expect(renderChart).toBeCalledTimes(1));
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
        expect(utils.getByText(Strings.ItemActivity.RecommendExpiredItems));
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
        await waitFor(() => expect(renderChart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });

    describe("with items expiring soon in inventory", () => {
      beforeEach(() => {
        utils = renderHelper(current);
      });

      it("should render a warning items expiring soon", () => {
        expect(
          utils.getByText(
            `${current.item.next_expiry_quantity} ${Strings.ItemActivity.RecommendExpiringSoon}`
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
        await waitFor(() => expect(renderChart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });

    describe("with no items expiring soon in inventory, but an old next_expiry_date set", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current.item.next_expiry_date = moment("2019-06-16");
        current.next_expiry_quantity = 0;
        utils = renderHelper(current);
      });

      it("should not render a warning items expiring soon", () => {
        expect(
          utils.queryByText(
            `${current.item.next_expiry_quantity} ${Strings.ItemActivity.RecommendExpiringSoon}`
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
        await waitFor(() => expect(renderChart).toBeCalledTimes(1));
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });
  });

  describe("before transactions are fetched", () => {
    beforeEach(() => {
      current.activity_report = { ...nullReport };
      jest.clearAllMocks();
      renderChart.mockReturnValue({ destroy: mockDestroy });
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
        expect(renderChart).toBeCalledTimes(0);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });
    });
  });
});
