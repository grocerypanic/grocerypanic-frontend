export const AnalyticsActions = {
  TestAction: { category: "Test", action: "Submitted a test action" },
  LoginError: { category: "Error", action: "Unable to login with backend" },
  LoginSuccess: { category: "Login", action: "Logged In" },
  ApiError: {
    category: "Error",
    action: "Unable to retrieve a requested object from the api",
  },
  FeedBackLink: {
    category: "Link",
    action: "Clicked on the feedback link",
  },
  ItemCreated: {
    category: "Item",
    action: "Created a new item",
  },
  ItemDeleted: {
    category: "Item",
    action: "Deleted an existing item",
  },
  ItemModified: {
    category: "Item",
    action: "Modified an existing item",
  },
  ProfileModified: {
    category: "User",
    action: "Profile saved",
  },
  TransactionConsume: {
    category: "Transaction",
    action: "Consumed an item",
  },
  TransactionRestock: {
    category: "Transaction",
    action: "Restocked an item",
  },
};

export const IndexedAnalyticsActions = {
  store: {
    delete: {
      category: "Store",
      action: "Deleted an existing store",
    },
    create: {
      category: "Item",
      action: "Created a new store",
    },
  },
  shelf: {
    delete: {
      category: "Shelf",
      action: "Deleted an existing shelf",
    },
    create: {
      category: "Item",
      action: "Created a new shelf",
    },
  },
};
