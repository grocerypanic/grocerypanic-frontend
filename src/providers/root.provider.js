// Single Provider That Can Be Imported

import React from "react";

import AnalyticsProvider from "./analytics/analytics.provider";
import HeaderProvider from "./header/header.provider";

import ActivityProvider from "./api/activity/activity.provider";
import ItemProvider from "./api/item/item.provider";
import ShelfProvider from "./api/shelf/shelf.provider";
import StoreProvider from "./api/store/store.provider";
import TimezoneProvider from "./api/timezone/timezone.provider";
import TransactionProvider from "./api/transaction/transaction.provider";
import UserProvider from "./api/user/user.provider";

import SocialProvider from "./social/social.provider";

const RootProvider = ({ children }) => {
  return (
    <SocialProvider>
      <HeaderProvider>
        <AnalyticsProvider>
          <ItemProvider>
            <ShelfProvider>
              <StoreProvider>
                <ActivityProvider>
                  <TimezoneProvider>
                    <TransactionProvider>
                      <UserProvider>{children}</UserProvider>
                    </TransactionProvider>
                  </TimezoneProvider>
                </ActivityProvider>
              </StoreProvider>
            </ShelfProvider>
          </ItemProvider>
        </AnalyticsProvider>
      </HeaderProvider>
    </SocialProvider>
  );
};

export default RootProvider;
