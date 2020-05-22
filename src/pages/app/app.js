// Package Imports
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AnalyticsProvider from "../../providers/analytics/analytics.provider";

// Configuration
import Routes from "../../configuration/routes";
import Strings from "../../configuration/strings";

// Lazy Loaded Components
const PlaceHolder = lazy(() =>
  import("../../components/placeholder/placeholder.component")
);

function App() {
  const { t } = useTranslation();
  return (
    <AnalyticsProvider>
      <Suspense fallback={<div>{t(Strings.Suspense)}</div>}>
        <Switch>
          <Route exact path={Routes.root} component={PlaceHolder} />
        </Switch>
      </Suspense>
    </AnalyticsProvider>
  );
}

export default App;
