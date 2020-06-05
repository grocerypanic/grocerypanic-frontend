export const SafeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];

export const Constants = {
  csrfLocalStorage: "csrf-token",
  csrfHeaderName: "X-CSRFToken",
  genericAPIError: "API Error",
  csrfErrorMessage: "Refresh csrf and try again.",
  alreadyRegistered: "User is already registered with this e-mail address.",
};

export const Providers = {
  google: "google",
  facebook: "facebook",
};

export const Paths = {
  googleLogin: "/api/v1/auth/social/google/",
  facebookLogin: "/api/v1/auth/social/facebook/",
  manageShelves: "/api/v1/shelf/",
  manageStores: "/api/v1/store/",
  refreshCSRF: "/api/v1/auth/csrf/",
};
