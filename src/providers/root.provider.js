// Single Provider That Can Be Imported

import React from "react";

import AnalyticsProvider from "./analytics/analytics.provider";

import ItemProvider from "./api/item/item.provider";
import ShelfProvider from "./api/shelf/shelf.provider";
import StoreProvider from "./api/store/store.provider";
import TransactionProvider from "./api/transaction/transaction.provider";

import UserProvider from "./user/user.provider";

const RootProvider = ({ children }) => {
  return (
    <UserProvider>
      <AnalyticsProvider>
        <ItemProvider>
          <ShelfProvider>
            <StoreProvider>
              <TransactionProvider>{children}</TransactionProvider>
            </StoreProvider>
          </ShelfProvider>
        </ItemProvider>
      </AnalyticsProvider>
    </UserProvider>
  );
};

export default RootProvider;
