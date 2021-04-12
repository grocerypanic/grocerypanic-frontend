import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { propCount } from "../../../test.fixtures/objectComparison";

import moment from "moment";

import ItemDetails from "../item-details.component";
import ItemDetailsForm from "../../item-details-form/item-details-form.component";
import ActivityReport, { nullReport } from "../../activity/activity.component";

import { HeaderContext } from "../../../providers/header/header.provider";
import initialHeaderSettings from "../../../providers/header/header.initial";

import Strings from "../../../configuration/strings";

const ActivityReportMocks = () => {
  const activityComponentModule = jest.requireActual(
    "../../activity/activity.component"
  );
  return {
    __esModule: true,
    ...activityComponentModule,
    default: jest.fn(),
  };
};

jest.mock("../../activity/activity.component", () => ActivityReportMocks());
jest.mock("../../item-details-form/item-details-form.component");

ItemDetailsForm.mockImplementation(() => <div>MockItemDetailsForm</div>);
ActivityReport.mockImplementation(() => <div>MockActivityReport</div>);

const mockHeaderUpdate = jest.fn();

const mockItem = {
  expired: 0,
  id: 1,
  name: "Vegan Cheese",
  next_expiry_date: moment("2020-06-15").utc(),
  next_expiry_quantity: 0,
  preferred_stores: [1],
  price: "4.00",
  quantity: 1,
  shelf: 2,
  shelf_life: 25,
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

const mockShelf = {
  id: 1,
  name: "Fridge",
};

const mockStore = {
  id: 1,
  name: "No Frills",
};

const props = {
  allItems: [mockItem],
  item: mockItem,
  headerTitle: "mockHeaderTitle",
  title: "mockTitle",
  helpText: Strings.Testing.GenericTranslationTestString,
  transaction: false,
  activity: [{ ...mockActivityReport }],
  activityStatus: false,
  stores: [mockStore],
  shelves: [mockShelf],
  handleSave: jest.fn(),
  handleDelete: jest.fn(),
  requestActivityReport: jest.fn(),
  duplicate: false,
  setDuplicate: jest.fn(),
};

const renderHelper = (currentProps) => {
  return render(
    <HeaderContext.Provider
      value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
    >
      <ItemDetails {...currentProps} />
    </HeaderContext.Provider>
  );
};

describe("Setup Environment", () => {
  let utils;
  let current;

  beforeAll(() =>
    jest.spyOn(document, "querySelector").mockImplementation(() => {
      return {
        clientWidth: 200,
      };
    })
  );

  afterAll(() => document.querySelector.mockRestore());

  describe("outside of a transaction", () => {
    describe.each([
      [
        "no report data present",
        {
          ...props,
          activityStatus: false,
          allItems: [...props.allItems],
          activity: [],
        },
      ],
      [
        "incorrect report data present",
        {
          ...props,
          activityStatus: false,
          allItems: [...props.allItems],
          activity: [{ id: 999, name: "wrong item" }],
        },
      ],
    ])("report_contents -> %s", (name, current) => {
      beforeEach(() => {
        jest.clearAllMocks();
        utils = renderHelper(current);
      });

      it("renders, should call header with the correct params", () => {
        expect(current.transaction).toBe(false);

        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          title: current.headerTitle,
          create: null,
          transaction: false,
          disableNav: false,
        });
      });

      it("renders, should create the tabs as expected", () => {
        expect(current.transaction).toBe(false);

        expect(utils.getByText(Strings.ItemDetails.Tabs.Stats)).toBeTruthy();
        expect(utils.getByText(Strings.ItemDetails.Tabs.Edit)).toBeTruthy();
      });

      it("renders, should should show the stats content as expected, and fetch transactions", async () => {
        expect(current.transaction).toBe(false);
        const tab1 = utils.getByText(Strings.ItemDetails.Tabs.Stats);
        const tab2 = utils.getByText(Strings.ItemDetails.Tabs.Edit);

        expect(props.requestActivityReport).toBeCalledTimes(0);
        fireEvent.click(tab1, "click");
        await waitFor(() =>
          expect(props.requestActivityReport).toBeCalledTimes(1)
        );

        expect(ItemDetailsForm).toBeCalledTimes(2);
        expect(tab1.className.search("active")).toBeGreaterThan(0);

        expect(ActivityReport).toBeCalledTimes(2);
        expect(tab2.className.search("active")).toBeLessThan(0);
      });

      it("renders, should should show the edit content as expected", async () => {
        expect(current.transaction).toBe(false);
        const tab1 = utils.getByText(Strings.ItemDetails.Tabs.Stats);
        const tab2 = utils.getByText(Strings.ItemDetails.Tabs.Edit);
        fireEvent.click(tab2, "click");

        expect(ItemDetailsForm).toBeCalledTimes(1);
        expect(tab2.className.search("active")).toBeGreaterThan(0);

        expect(ActivityReport).toBeCalledTimes(1);
        expect(tab1.className.search("active")).toBeLessThan(0);
      });

      it("renders, should call ItemDetailsForm as expected", async () => {
        expect(current.transaction).toBe(false);

        expect(ItemDetailsForm).toBeCalledTimes(1);
        const call = ItemDetailsForm.mock.calls[0][0];
        propCount(call, 11);

        expect(call.allItems).toBe(current.allItems);
        expect(call.item).toBe(mockItem);
        expect(call.title).toBe(current.title);
        expect(call.helpText).toBe(current.helpText);
        expect(call.transaction).toBe(false);
        expect(call.stores).toStrictEqual([mockStore]);
        expect(call.shelves).toStrictEqual([mockShelf]);
        expect(call.handleSave).toBe(current.handleSave);
        expect(call.handleDelete).toBe(current.handleDelete);
        expect(call.duplicate).toBe(current.duplicate);
        expect(call.setDuplicate).toBe(current.setDuplicate);
      });

      it("renders, should call ActivityReport as expected", async () => {
        expect(current.transaction).toBe(false);

        expect(ActivityReport).toBeCalledTimes(1);
        const call = ActivityReport.mock.calls[0][0];
        propCount(call, 2);

        expect(call.item).toBe(mockItem);
        expect(call.activity_report).toStrictEqual(nullReport);
      });
    });

    describe("correct report data retrieved", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        current = {
          ...props,
          activityStatus: false,
          allItems: [...props.allItems],
        };
        utils = renderHelper(current);
      });
      afterEach(cleanup);

      it("renders, should call header with the correct params", () => {
        expect(current.transaction).toBe(false);

        expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
        expect(mockHeaderUpdate).toBeCalledWith({
          title: current.headerTitle,
          create: null,
          transaction: false,
          disableNav: false,
        });
      });

      it("renders, should create the tabs as expected", () => {
        expect(current.transaction).toBe(false);

        expect(utils.getByText(Strings.ItemDetails.Tabs.Stats)).toBeTruthy();
        expect(utils.getByText(Strings.ItemDetails.Tabs.Edit)).toBeTruthy();
      });

      it("renders, should should show the stats content as expected, and fetch transactions", async () => {
        expect(current.transaction).toBe(false);
        const tab1 = utils.getByText(Strings.ItemDetails.Tabs.Stats);
        const tab2 = utils.getByText(Strings.ItemDetails.Tabs.Edit);

        expect(props.requestActivityReport).toBeCalledTimes(0);
        fireEvent.click(tab1, "click");
        await waitFor(() =>
          expect(props.requestActivityReport).toBeCalledTimes(1)
        );

        expect(ItemDetailsForm).toBeCalledTimes(3);
        expect(tab1.className.search("active")).toBeGreaterThan(0);

        expect(ActivityReport).toBeCalledTimes(3);
        expect(tab2.className.search("active")).toBeLessThan(0);
      });

      it("renders, should should show the edit content as expected", async () => {
        expect(current.transaction).toBe(false);
        const tab1 = utils.getByText(Strings.ItemDetails.Tabs.Stats);
        const tab2 = utils.getByText(Strings.ItemDetails.Tabs.Edit);
        fireEvent.click(tab2, "click");

        expect(ItemDetailsForm).toBeCalledTimes(2);
        expect(tab2.className.search("active")).toBeGreaterThan(0);

        expect(ActivityReport).toBeCalledTimes(2);
        expect(tab1.className.search("active")).toBeLessThan(0);
      });

      it("renders, should call ItemDetailsForm as expected", async () => {
        expect(current.transaction).toBe(false);

        expect(ItemDetailsForm).toBeCalledTimes(2);
        const call = ItemDetailsForm.mock.calls[1][0];
        propCount(call, 11);

        expect(call.allItems).toBe(current.allItems);
        expect(call.item).toBe(mockItem);
        expect(call.title).toBe(current.title);
        expect(call.helpText).toBe(current.helpText);
        expect(call.transaction).toBe(false);
        expect(call.stores).toStrictEqual([mockStore]);
        expect(call.shelves).toStrictEqual([mockShelf]);
        expect(call.handleSave).toBe(current.handleSave);
        expect(call.handleDelete).toBe(current.handleDelete);
        expect(call.duplicate).toBe(current.duplicate);
        expect(call.setDuplicate).toBe(current.setDuplicate);
      });

      it("renders, should call ActivityReport as expected", async () => {
        expect(current.transaction).toBe(false);

        expect(ActivityReport).toBeCalledTimes(2);
        const call = ActivityReport.mock.calls[1][0];
        propCount(call, 2);

        expect(call.item).toBe(mockItem);
        expect(call.activity_report).toStrictEqual(mockActivityReport);
      });
    });
  });

  describe("during a transaction", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      current = { ...props, transaction: true };
      utils = renderHelper(current);
    });
    afterEach(cleanup);

    it("renders, should call header with the correct params", () => {
      expect(current.transaction).toBe(true);

      expect(mockHeaderUpdate).toHaveBeenCalledTimes(1);
      expect(mockHeaderUpdate).toBeCalledWith({
        title: current.headerTitle,
        create: null,
        transaction: true,
        disableNav: false,
      });
    });

    it("renders, should still navigate to the stats page", async () => {
      expect(current.transaction).toBe(true);
      const tab1 = utils.getByText(Strings.ItemDetails.Tabs.Stats);
      const tab2 = utils.getByText(Strings.ItemDetails.Tabs.Edit);
      fireEvent.click(tab1, "click");

      expect(ItemDetailsForm).toBeCalledTimes(3);
      expect(tab1.className.search("active")).toBeGreaterThan(0);

      expect(ActivityReport).toBeCalledTimes(3);
      expect(tab2.className.search("active")).toBeLessThan(0);
    });

    it("should respond to a screen orientation change by flipping back to the edit tab", async () => {
      expect(current.transaction).toBe(true);
      const tab1 = utils.getByText(Strings.ItemDetails.Tabs.Stats);
      const tab2 = utils.getByText(Strings.ItemDetails.Tabs.Edit);
      fireEvent.click(tab2, "click");
      fireEvent(window, new Event("orientationchange"));

      expect(ActivityReport).toBeCalledTimes(2);
      expect(tab2.className.search("active")).toBeGreaterThan(0);

      expect(ItemDetailsForm).toBeCalledTimes(2);
      expect(tab1.className.search("active")).toBeLessThan(0);
    });

    it("renders, should call ItemDetailsForm as expected", async () => {
      expect(current.transaction).toBe(true);

      expect(ItemDetailsForm).toBeCalledTimes(2);
      const call = ItemDetailsForm.mock.calls[1][0];
      propCount(call, 11);

      expect(call.allItems).toBe(current.allItems);
      expect(call.item).toBe(mockItem);
      expect(call.title).toBe(current.title);
      expect(call.helpText).toBe(current.helpText);
      expect(call.transaction).toBe(true);
      expect(call.stores).toStrictEqual([mockStore]);
      expect(call.shelves).toStrictEqual([mockShelf]);
      expect(call.handleSave).toBe(current.handleSave);
      expect(call.handleDelete).toBe(current.handleDelete);
      expect(call.duplicate).toBe(current.duplicate);
      expect(call.setDuplicate).toBe(current.setDuplicate);
    });

    it("renders, should call ActivityReport as expected", async () => {
      expect(current.transaction).toBe(true);

      expect(ActivityReport).toBeCalledTimes(2);
      const call = ActivityReport.mock.calls[1][0];
      propCount(call, 2);

      expect(call.item).toBe(mockItem);
      expect(call.activity_report).toStrictEqual(mockActivityReport);
    });
  });
});
