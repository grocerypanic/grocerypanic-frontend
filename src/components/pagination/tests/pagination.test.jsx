import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";

import Pagination from "../pagination.component";

const mockApiObject = {
  next: null,
  previous: null,
};

const handlePagination = jest.fn();

describe("When there is an active previous", () => {
  let mockState = {};
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      apiObject: { ...mockApiObject, previous: "previous" },
      handlePagination,
    };
  });
  describe("When there is an active next", () => {
    beforeEach(() => {
      mockState.apiObject.next = "next";
      utils = render(<Pagination {...mockState} />);
    });

    it("should render with the expected controls and state", () => {
      const previous = utils.getByTestId("previous");
      const next = utils.getByTestId("next");

      expect(previous.parentElement.className).toBe("page-item ");
      expect(next.parentElement.className).toBe("page-item ");
    });

    it("should handle a click on previous as expected", async (done) => {
      const node = utils.getByTestId("previous");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith("previous"));
      done();
    });

    it("should handle a click on next as expected", async (done) => {
      const node = utils.getByTestId("next");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith("next"));
      done();
    });
  });

  describe("When there is an inactive next", () => {
    beforeEach(() => {
      mockState.apiObject.next = null;
      utils = render(<Pagination {...mockState} />);
    });

    it("should render with the expected controls and state", () => {
      const previous = utils.getByTestId("previous");
      const next = utils.getByTestId("next");

      expect(previous.parentElement.className).toBe("page-item ");
      expect(next.parentElement.className).toBe("page-item disabled");
    });

    it("should handle a click on previous as expected", async (done) => {
      const node = utils.getByTestId("previous");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith("previous"));
      done();
    });

    it("should handle a click on next as expected", async (done) => {
      const node = utils.getByTestId("next");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith(null));
      done();
    });
  });
});

describe("When there is an inactive previous", () => {
  let mockState = {};
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      apiObject: { ...mockApiObject, previous: null },
      handlePagination,
    };
  });
  describe("When there is an active next", () => {
    beforeEach(() => {
      mockState.apiObject.next = "next";
      utils = render(<Pagination {...mockState} />);
    });

    it("should render with the expected controls and state", () => {
      const previous = utils.getByTestId("previous");
      const next = utils.getByTestId("next");

      expect(previous.parentElement.className).toBe("page-item disabled");
      expect(next.parentElement.className).toBe("page-item ");
    });

    it("should handle a click on previous as expected", async (done) => {
      const node = utils.getByTestId("previous");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith(null));
      done();
    });

    it("should handle a click on next as expected", async (done) => {
      const node = utils.getByTestId("next");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith("next"));
      done();
    });
  });

  describe("When there is an inactive next", () => {
    beforeEach(() => {
      mockState.apiObject.next = null;
      utils = render(<Pagination {...mockState} />);
    });

    it("should render with the expected controls and state", () => {
      const previous = utils.getByTestId("previous");
      const next = utils.getByTestId("next");

      expect(previous.parentElement.className).toBe("page-item disabled");
      expect(next.parentElement.className).toBe("page-item disabled");
    });

    it("should handle a click on previous as expected", async (done) => {
      const node = utils.getByTestId("previous");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith(null));
      done();
    });

    it("should handle a click on next as expected", async (done) => {
      const node = utils.getByTestId("next");
      fireEvent.click(node);
      await waitFor(() => expect(handlePagination).toBeCalledWith(null));
      done();
    });
  });
});
