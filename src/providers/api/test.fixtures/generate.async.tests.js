import { waitFor } from "@testing-library/react";

import ApiActions from "../api.actions";
import ApiFunctions from "../api.functions";

import { generateConverter } from "../api.util";
import { Constants } from "../../../configuration/backend";

import Request from "../../../util/requests";
jest.mock("../../../util/requests");

// Freeze Time
Date.now = jest.fn(() => new Date("2019-06-16T11:01:58.135Z"));

export const AsyncTest = (
  apiEndpoint,
  initialState,
  asyncFn,
  implemented, // List of implemented api functions
  optionalListParams = {}
) => {
  const mockDispatch = jest.fn();
  const mockCallBack = jest.fn();

  const convertDatesToLocal = generateConverter(initialState.class);

  const mockObject = {
    id: 1,
    name: "MockObject",
    next_expiry_date: "2020-01-01",
    datetime: "2020-01-01",
  };

  const mockObject2 = {
    id: 2,
    name: "MockObject",
    next_expiry_date: "2021-01-01",
    datetime: "2021-01-01",
  };

  const comparisonObject = convertDatesToLocal(mockObject);

  let responseCode;
  let State1;
  let State2;
  let action;

  describe("Check Each Async Function Handles Successful, and Unsuccessful API Actions", () => {
    describe("Successful API Response", () => {
      beforeEach((done) => {
        jest.clearAllMocks();
        State1 = { ...initialState, inventory: [...initialState.inventory] };
        responseCode = 201;
        Request.mockReturnValue([{ ...mockObject }, responseCode]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.unshift({ ...comparisonObject });

          asyncFn.asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessAdd,
            payload: {
              inventory: State2.inventory,
            },
            callback: undefined,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncDel)) {
        it("should call the API, and then dispatch correctly when asyncDel is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncDel({ state: State2, action });

          expect(Request).toBeCalledWith(
            "DELETE",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessDel,
            payload: {
              inventory: State1.inventory,
            },
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncList)) {
        it("should call the API, and then dispatch correctly when asyncList is called", async () => {
          action = {
            payload: { id: mockObject.id }, // Support Transaction Lookups
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([
            {
              results: [{ ...mockObject }],
              next: "next",
              previous: "previous",
            },
            responseCode,
          ]);

          asyncFn.asyncList({ state: State2, action });

          let url = apiEndpoint;
          if (Object.keys(optionalListParams).length > 0)
            url =
              url + "?" + new URLSearchParams(optionalListParams).toString();

          expect(Request).toBeCalledWith("GET", url);
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessList,
            payload: {
              inventory: [{ ...comparisonObject }],
              next: "next",
              previous: "previous",
            },
            callback: mockCallBack,
          });
        });

        it("should call the API, and then dispatch correctly when asyncList is called with a override argument", async () => {
          action = {
            payload: { id: mockObject.id }, // Support Transaction Lookups
            dispatch: mockDispatch,
            callback: mockCallBack,
            override: "http://paginated.target.url/from/django/api",
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([
            {
              results: [{ ...mockObject }],
              next: "next",
              previous: "previous",
            },
            responseCode,
          ]);

          asyncFn.asyncList({ state: State2, action });

          let url = action.override;

          expect(Request).toBeCalledWith("GET", url);
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessList,
            payload: {
              inventory: [{ ...comparisonObject }],
              next: "next",
              previous: "previous",
            },
            callback: mockCallBack,
          });
        });

        it("should call the API, and then dispatch correctly when asyncList is called with a page request", async () => {
          action = {
            payload: { id: mockObject.id }, // Support Transaction Lookups
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          action[Constants.pageLookupParam] = 2; // Assign page lookup by backend constant
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([
            {
              results: [{ ...mockObject }],
              next: "next",
              previous: "previous",
            },
            responseCode,
          ]);

          asyncFn.asyncList({ state: State2, action });

          let params = new URLSearchParams({ page: action.page }).toString();
          if (Object.keys(optionalListParams).length > 0) {
            if (params) params += "&";
            params =
              params + new URLSearchParams(optionalListParams).toString();
          }

          expect(Request).toBeCalledWith("GET", apiEndpoint + "?" + params);
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessList,
            payload: {
              inventory: [{ ...comparisonObject }],
              next: "next",
              previous: "previous",
            },
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncGet)) {
        it("should call the API, and then dispatch correctly when asyncGet is called, item already in state", async () => {
          const oldObjectState = {
            ...mockObject,
            name: "This name needs to be updated.",
          };
          let newState = [{ ...mockObject }];

          action = {
            payload: { id: mockObject.id },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push(oldObjectState);

          asyncFn.asyncGet({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + `${mockObject.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          newState = newState.map((i) => convertDatesToLocal(i));

          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessGet,
            payload: {
              inventory: newState,
            },
            callback: mockCallBack,
          });
        });

        it("should call the API, and then dispatch correctly when asyncGet is called, item not in existing state", async () => {
          // mockobject2 is in state, fetching mockobject

          action = {
            payload: { id: mockObject.id },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject2 });

          asyncFn.asyncGet({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + `${mockObject.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessGet,
            payload: {
              inventory: [...State2.inventory, convertDatesToLocal(mockObject)],
            },
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncUpdate)) {
        it("should call the API, and then dispatch correctly when asyncUpdate is called", async () => {
          action = {
            payload: { ...mockObject, name: "updated name goes here" },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          Request.mockReturnValue([{ ...action.payload }, responseCode]);

          asyncFn.asyncUpdate({ state: State2, action });

          expect(Request).toBeCalledWith(
            "PUT",
            apiEndpoint + `${mockObject.id}/`,
            {
              ...action.payload,
            }
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.SuccessUpdate,
            payload: {
              inventory: [{ ...action.payload }].map((i) =>
                convertDatesToLocal(i)
              ),
            },
            callback: mockCallBack,
          });
        });
      }
    });

    describe("Unsuccessful API Response", () => {
      beforeEach((done) => {
        jest.clearAllMocks();
        State1 = { ...initialState, inventory: [...initialState.inventory] };
        responseCode = 404;
        Request.mockReturnValue([{ ...mockObject }, responseCode]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAdd,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncDel)) {
        it("should call the API, and then dispatch correctly when asyncDel is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncDel({ state: State2, action });

          expect(Request).toBeCalledWith(
            "DELETE",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureDel,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncList)) {
        it("should call the API, and then dispatch correctly when asyncList is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([[{ ...mockObject }], responseCode]);

          asyncFn.asyncList({ state: State2, action });

          let url = apiEndpoint;
          if (Object.keys(optionalListParams).length > 0)
            url =
              url + "?" + new URLSearchParams(optionalListParams).toString();

          expect(Request).toBeCalledWith("GET", url);
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureList,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncGet)) {
        it("should call the API, and then dispatch correctly when asyncGet is called", async () => {
          action = {
            payload: { id: mockObject.id },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncGet({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureGet,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncUpdate)) {
        it("should call the API, and then dispatch correctly when asyncUpdate is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncUpdate({ state: State2, action });

          expect(Request).toBeCalledWith(
            "PUT",
            apiEndpoint + `${action.payload.id}/`,
            { ...mockObject }
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureUpdate,
            callback: mockCallBack,
          });
        });
      }
    });

    describe("Authentication Error Response", () => {
      beforeEach((done) => {
        jest.clearAllMocks();
        State1 = { ...initialState, inventory: [...initialState.inventory] };
        responseCode = 401;
        Request.mockReturnValue([{ ...mockObject }, responseCode]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncDel)) {
        it("should call the API, and then dispatch correctly when asyncDel is called", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncDel({ state: State2, action });

          expect(Request).toBeCalledWith(
            "DELETE",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncList)) {
        it("should call the API, and then dispatch correctly when asyncList is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });
          Request.mockReturnValue([[{ ...mockObject }], responseCode]);

          asyncFn.asyncList({ state: State2, action });

          let url = apiEndpoint;
          if (Object.keys(optionalListParams).length > 0)
            url =
              url + "?" + new URLSearchParams(optionalListParams).toString();

          expect(Request).toBeCalledWith("GET", url);
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncGet)) {
        it("should call the API, and then dispatch correctly when asyncGet is called", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncGet({ state: State2, action });

          expect(Request).toBeCalledWith(
            "GET",
            apiEndpoint + `${action.payload.id}/`
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncUpdate)) {
        it("should call the API, and then dispatch correctly when asyncUpdate is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncUpdate({ state: State2, action });

          expect(Request).toBeCalledWith(
            "PUT",
            apiEndpoint + `${action.payload.id}/`,
            { ...mockObject }
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.FailureAuth,
            callback: mockCallBack,
          });
        });
      }
    });

    describe("Duplicate Object Error Response", () => {
      beforeEach((done) => {
        jest.clearAllMocks();
        State1 = { ...initialState, inventory: [...initialState.inventory] };
        responseCode = 400;
        Request.mockReturnValue([
          { ...Constants.duplicateObjectApiError },
          responseCode,
        ]);
        done();
      });

      if (implemented.includes(ApiFunctions.asyncAdd)) {
        it("should call the API, and then dispatch correctly when asyncAdd is called", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };

          asyncFn.asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.DuplicateObject,
            callback: mockCallBack,
          });
        });

        it("should call the API, and then dispatch correctly when asyncAdd is called, no callback", async () => {
          action = {
            payload: { name: mockObject.name },
            dispatch: mockDispatch,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };

          asyncFn.asyncAdd({ state: State1, action });

          expect(Request).toBeCalledWith("POST", apiEndpoint, {
            name: action.payload.name,
          });
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.DuplicateObject,
            callback: undefined,
          });
        });
      }

      if (implemented.includes(ApiFunctions.asyncUpdate)) {
        it("should call the API, and then dispatch correctly when asyncUpdate is called", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncUpdate({ state: State2, action });

          expect(Request).toBeCalledWith(
            "PUT",
            apiEndpoint + `${action.payload.id}/`,
            { ...mockObject }
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.DuplicateObject,
            callback: mockCallBack,
          });
        });
        it("should call the API, and then dispatch correctly when asyncUpdate is called, no callback", async () => {
          action = {
            payload: { ...mockObject },
            dispatch: mockDispatch,
            callback: mockCallBack,
          };
          State2 = {
            ...State1,
            inventory: [...State1.inventory],
          };
          State2.inventory.push({ ...mockObject });

          asyncFn.asyncUpdate({ state: State2, action });

          expect(Request).toBeCalledWith(
            "PUT",
            apiEndpoint + `${action.payload.id}/`,
            { ...mockObject }
          );
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
          expect(mockDispatch).toBeCalledWith({
            type: ApiActions.DuplicateObject,
            callback: mockCallBack,
          });
        });
      }
    });
  });
};
