import { render, cleanup } from "@testing-library/react";
import React from "react";
import AnalyticsProvider from "../analytics/analytics.provider";
import ActivityProvider from "../api/activity/activity.provider";
import ItemProvider from "../api/item/item.provider";
import ShelfProvider from "../api/shelf/shelf.provider";
import StoreProvider from "../api/store/store.provider";
import TimezoneProvider from "../api/timezone/timezone.provider";
import TransactionProvider from "../api/transaction/transaction.provider";
import UserProvider from "../api/user/user.provider";
import HeaderProvider from "../header/header.provider";
import RootProvider from "../root.provider";
import SocialProvider from "../social/social.provider";

jest.mock("../api/activity/activity.provider");
jest.mock("../analytics/analytics.provider");
jest.mock("../header/header.provider");
jest.mock("../api/item/item.provider");
jest.mock("../api/shelf/shelf.provider");
jest.mock("../api/store/store.provider");
jest.mock("../api/timezone/timezone.provider");
jest.mock("../api/transaction/transaction.provider");
jest.mock("../social/social.provider");
jest.mock("../api/user/user.provider");

ActivityProvider.mockImplementation(({ children }) => children);
AnalyticsProvider.mockImplementation(({ children }) => children);
HeaderProvider.mockImplementation(({ children }) => children);
ItemProvider.mockImplementation(({ children }) => children);
ShelfProvider.mockImplementation(({ children }) => children);
SocialProvider.mockImplementation(({ children }) => children);
StoreProvider.mockImplementation(({ children }) => children);
TimezoneProvider.mockImplementation(({ children }) => children);
TransactionProvider.mockImplementation(({ children }) => children);
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
  expect(HeaderProvider).toHaveBeenCalledTimes(1);
  expect(ActivityProvider).toHaveBeenCalledTimes(1);
  expect(ShelfProvider).toHaveBeenCalledTimes(1);
  expect(ItemProvider).toHaveBeenCalledTimes(1);
  expect(StoreProvider).toHaveBeenCalledTimes(1);
  expect(TimezoneProvider).toHaveBeenCalledTimes(1);
  expect(TransactionProvider).toHaveBeenCalledTimes(1);
  expect(SocialProvider).toHaveBeenCalledTimes(1);
  expect(UserProvider).toHaveBeenCalledTimes(1);

  expect(utils.findByText("Missing Ingredients")).toBeTruthy();
});
