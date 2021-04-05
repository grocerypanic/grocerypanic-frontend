// Single Provider That Can Be Imported

import React from "react";

import AnalyticsProvider from "./analytics/analytics.provider";
import HeaderProvider from "./header/header.provider";

import ActivityProvider from "./api/activity/activity.provider";
import ItemProvider from "./api/item/item.provider";
import ShelfProvider from "./api/shelf/shelf.provider";
import StoreProvider from "./api/store/store.provider";
import TransactionProvider from "./api/transaction/transaction.provider";

import UserProvider from "./user/user.provider";

const RootProvider = ({ children }) => {
  return (
    <UserProvider>
      <HeaderProvider>
        <AnalyticsProvider>
          <ItemProvider>
            <ShelfProvider>
              <StoreProvider>
                <ActivityProvider>
                  <TransactionProvider>{children}</TransactionProvider>
                </ActivityProvider>
              </StoreProvider>
            </ShelfProvider>
          </ItemProvider>
        </AnalyticsProvider>
      </HeaderProvider>
    </UserProvider>
  );
};

export default RootProvider;
