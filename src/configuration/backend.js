export const SafeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];
export const ItemFilters = ["preferred_stores", "shelf"];
export const FilterTag = "filter_tag";

export const Constants = {
  csrfLocalStorage: "csrf-token",
  csrfHeaderName: "X-CSRFToken",
  genericAPIError: "API Error",
  csrfErrorMessage: "Refresh csrf and try again.",
  alreadyRegistered: "User is already registered with this e-mail address.",
  minimumQuanity: 0,
  maximumQuantity: 10000,
  minimumShelfLife: 1,
  maximumShelfLife: 365 * 3,
  defaultShelfLife: 7,
  minimumPrice: 0,
  maximumPrice: 9999,
  maximumTransactionHistory: 14,
  AnalyticsCookieName: "PanicDataConsent-" + process.env.NODE_ENV.toUpperCase(),
  duplicateObjectApiError: { non_field_errors: ["Object already exists."] },
  pageLookupParam: "page",
  pageOverrideParam: "all_results",
};

export const Providers = {
  google: "google",
  facebook: "facebook",
};

export const Paths = {
  googleLogin: "/api/v1/auth/social/google/",
  facebookLogin: "/api/v1/auth/social/facebook/",
  manageShelves: "/api/v1/shelves/",
  manageStores: "/api/v1/stores/",
  manageItems: "/api/v1/items/",
  refreshCSRF: "/api/v1/auth/csrf/",
  manageTransactions: "/api/v1/transactions/",
};

const month = 30;
const year = 365;

export const ShelfLifeConstants = [
  { name: "3 Days", id: 3 },
  { name: "1 Week", id: 7 },
  { name: "2 Weeks", id: 14 },
  { name: "3 Weeks", id: 21 },
  { name: "1 Month", id: month },
  { name: "2 Months", id: month * 2 },
  { name: "3 Months", id: month * 3 },
  { name: "6 Months", id: month * 6 },
  { name: "1 Year", id: year },
  { name: "2 Years", id: year * 2 },
  { name: "3 Years", id: year * 3 },
];
