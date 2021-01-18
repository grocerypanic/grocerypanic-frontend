import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";

import Pagination from "../pagination.component";
import { rewriteUrlWithPagination } from "../pagination.query.utils";

const mockApiObject = {
  next: null,
  previous: null,
};

jest.mock("../pagination.query.utils");
const handlePagination = jest.fn();

describe("inside of a transaction", () => {
  let mockState = {};
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      apiObject: { ...mockApiObject, transaction: true },
      handlePagination,
    };
  });
  describe("When there is an active previous", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockState.apiObject.previous = "previous";
    });
    describe("When there is an active next", () => {
      beforeEach(() => {
        mockState.apiObject.next = "next";
        utils = render(<Pagination {...mockState} />);
      });

      it("should render the spacer, not the controls", () => {
        const previous = utils.queryByTestId("previous");
        const next = utils.queryByTestId("next");
        const spacer = utils.getByTestId("spacer");

        expect(previous).toBeFalsy();
        expect(next).toBeFalsy();
        expect(spacer).toBeTruthy();
      });
    });

    describe("When there is an inactive next", () => {
      beforeEach(() => {
        mockState.apiObject.next = null;
        utils = render(<Pagination {...mockState} />);
      });

      it("should render the spacer, not the controls", () => {
        const previous = utils.queryByTestId("previous");
        const next = utils.queryByTestId("next");
        const spacer = utils.getByTestId("spacer");

        expect(previous).toBeFalsy();
        expect(next).toBeFalsy();
        expect(spacer).toBeTruthy();
      });
    });
  });

  describe("When there is an inactive previous", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockState.apiObject.previous = null;
    });
    describe("When there is an active next", () => {
      beforeEach(() => {
        mockState.apiObject.next = "next";
        utils = render(<Pagination {...mockState} />);
      });

      it("should render the spacer, not the controls", () => {
        const previous = utils.queryByTestId("previous");
        const next = utils.queryByTestId("next");
        const spacer = utils.getByTestId("spacer");

        expect(previous).toBeFalsy();
        expect(next).toBeFalsy();
        expect(spacer).toBeTruthy();
      });
    });

    describe("When there is an inactive next", () => {
      beforeEach(() => {
        mockState.apiObject.next = null;
        utils = render(<Pagination {...mockState} />);
      });

      it("should render the spacer, not the controls", () => {
        const previous = utils.queryByTestId("previous");
        const next = utils.queryByTestId("next");
        const spacer = utils.getByTestId("spacer");

        expect(previous).toBeFalsy();
        expect(next).toBeFalsy();
        expect(spacer).toBeTruthy();
      });
    });
  });
});

describe("outside of a transaction", () => {
  let mockState = {};
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      apiObject: { ...mockApiObject, transaction: false },
      handlePagination,
    };
  });
  describe("When there is an active previous", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockState.apiObject.previous = "previous";
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

      it("should handle a click on previous as expected", async () => {
        const node = utils.getByTestId("previous");
        fireEvent.click(node);
        await waitFor(() =>
          expect(handlePagination).toBeCalledWith("previous")
        );
        expect(rewriteUrlWithPagination).toBeCalledWith("previous");
      });

      it("should handle a click on next as expected", async () => {
        const node = utils.getByTestId("next");
        fireEvent.click(node);
        await waitFor(() => expect(handlePagination).toBeCalledWith("next"));
        expect(rewriteUrlWithPagination).toBeCalledWith("next");
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

      it("should handle a click on previous as expected", async () => {
        const node = utils.getByTestId("previous");
        fireEvent.click(node);
        await waitFor(() =>
          expect(handlePagination).toBeCalledWith("previous")
        );
        expect(rewriteUrlWithPagination).toBeCalledWith("previous");
      });

      it("should handle a click on next as expected, by not actioning it", async () => {
        const node = utils.getByTestId("next");
        fireEvent.click(node);
        await waitFor(() => expect(handlePagination).toBeCalledTimes(0));
        expect(rewriteUrlWithPagination).toBeCalledTimes(0);
      });
    });
  });

  describe("When there is an inactive previous", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockState.apiObject.previous = null;
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

      it("should handle a click on previous as expected, by not actioning it", async () => {
        const node = utils.getByTestId("previous");
        fireEvent.click(node);
        await waitFor(() => expect(handlePagination).toBeCalledTimes(0));
        expect(rewriteUrlWithPagination).toBeCalledTimes(0);
      });

      it("should handle a click on next as expected", async () => {
        const node = utils.getByTestId("next");
        fireEvent.click(node);
        await waitFor(() => expect(handlePagination).toBeCalledWith("next"));
        expect(rewriteUrlWithPagination).toBeCalledWith("next");
      });
    });

    describe("When there is an inactive next", () => {
      beforeEach(() => {
        mockState.apiObject.next = null;
        utils = render(<Pagination {...mockState} />);
      });

      it("should render the spacer, not the controls", () => {
        const previous = utils.queryByTestId("previous");
        const next = utils.queryByTestId("next");
        const spacer = utils.getByTestId("spacer");

        expect(previous).toBeFalsy();
        expect(next).toBeFalsy();
        expect(spacer).toBeTruthy();
      });
    });
  });
});
