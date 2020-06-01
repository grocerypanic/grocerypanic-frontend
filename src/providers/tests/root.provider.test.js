import React from "react";
import { render, cleanup } from "@testing-library/react";

import RootProvider from "../root.provider";

import AnalyticsProvider from "../analytics/analytics.provider";
import ShelfProvider from "../api/shelf/shelf.provider";
import UserProvider from "../user/user.provider";

jest.mock("../analytics/analytics.provider");
jest.mock("../api/shelf/shelf.provider");
jest.mock("../user/user.provider");

AnalyticsProvider.mockImplementation(({ children }) => children);
ShelfProvider.mockImplementation(({ children }) => children);
UserProvider.mockImplementation(({ children }) => children);

let utils;

beforeEach(() => {
  jest.clearAllMocks();
  utils = render(
    <RootProvider>
      <div>Missing Ingredients</div>
    </RootProvider>
  );
});

afterEach(cleanup);

it("should render with the correct message", () => {
  expect(AnalyticsProvider).toHaveBeenCalledTimes(1);
  expect(ShelfProvider).toHaveBeenCalledTimes(1);
  expect(UserProvider).toHaveBeenCalledTimes(1);
  expect(utils.findByText("Missing Ingredients")).toBeTruthy();
});
