import moment from "moment";
import { generateConverter, generateUTCConverter } from "../generate.converter";

const mockItem = {
  id: 99,
  name: "Vegan Cheese",
  shelf: 22,
  preferred_stores: [1],
  price: "5.00",
  quantity: 1,
  shelf_life: 99,
  next_expiry: "2020-06-15",
  next_expiry_quantity: 5,
  expired: 0,
};

const mockTransaction = {
  id: 99,
  item: 22,
  datetime: "2020-01-15",
  quantity: 5,
};

const mockActivityReport = {
  id: 99,
  activity_first: "2020-01-15",
};

const mockGenericItem = {
  id: 99,
  generic_field: "2020-01-15",
};

describe("Check generateConverter works as expected", () => {
  let convertDatesToLocal;

  describe("when working on items", () => {
    beforeEach(() => {
      convertDatesToLocal = generateConverter("item");
    });

    it("should convert item expiry when given a string as input", () => {
      convertDatesToLocal = generateConverter("item");
      const testDate = "2020-01-01";
      const testDateAsDate = moment.utc(testDate).unix();
      let expected = testDateAsDate + moment().utcOffset() * 60;
      expected = moment
        .unix(expected)
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
        .unix();

      const testObject = { ...mockItem, next_expiry_date: testDate };
      const converted = convertDatesToLocal(testObject);

      expect(expected).toBe(converted.next_expiry_date.unix());
    });

    it("should return an untouched item expiry when given a moment object as input", () => {
      const testDate = "2020-01-01";
      const testDateAsDate = moment.utc(testDate);

      const testObject = { ...mockItem, next_expiry_date: testDateAsDate };
      const converted = convertDatesToLocal(testObject);

      expect(converted).toBe(testObject);
    });
  });

  describe("when working on transactions", () => {
    beforeEach(() => {
      convertDatesToLocal = generateConverter("transaction");
    });

    it("should convert transaction date when given a string as input", () => {
      const testDate = "2020-01-01";
      const expected = moment.utc(testDate).local();

      const testObject = { ...mockTransaction, datetime: testDate };
      const converted = convertDatesToLocal(testObject);

      expect(expected).toStrictEqual(converted.datetime);
    });

    it("should return an untouched item expiry when given a moment object as input", () => {
      const testDate = "2020-01-01";
      const testDateAsDate = moment.utc(testDate);

      const testObject = { ...mockTransaction, datetime: testDateAsDate };
      const converted = convertDatesToLocal(testObject);

      expect(converted).toBe(testObject);
    });
  });
});

describe("Check generateUTCConverter works as expected", () => {
  let convertTimeStamp;

  describe("when working on activity reports", () => {
    beforeEach(() => {
      convertTimeStamp = generateUTCConverter("activity");
    });

    it("should convert activity report date fields", () => {
      convertTimeStamp = generateUTCConverter("activity");
      const testDate = "2020-01-01";
      const expected = moment.utc(testDate);

      const testObject = { ...mockActivityReport, activity_first: testDate };
      const converted = convertTimeStamp(testObject);

      expect(expected).toStrictEqual(converted.activity_first);
    });

    it("should not affect already convereted activity report date fields", () => {
      const testDate = "2020-01-01";
      const expected = moment.utc(testDate);

      const testObject = {
        ...mockActivityReport,
        activity_first: expected,
      };
      const converted = convertTimeStamp(testObject);

      expect(converted).toBe(testObject);
    });

    it("should ignore fields that aren't related to the activity report", () => {
      const testObject = {
        ...mockGenericItem,
      };
      const converted = convertTimeStamp(testObject);

      expect(converted).toBe(testObject);
    });
  });
});
