// Package Imports
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import RootProvider from "../../providers/root.provider";
import ProtectedRoute from "../../components/protected-route/protected-route.component";

// Configuration
import Routes from "../../configuration/routes";
import Strings from "../../configuration/strings";

const SignIn = lazy(() => import("../signin/signin.container"));
const Shelves = lazy(() => import("../shelves/shelves.page"));

function App() {
  const { t } = useTranslation();
  return (
    <RootProvider>
      <Suspense fallback={<div>{t(Strings.Suspense)}</div>}>
        <Switch>
          <ProtectedRoute
            exact
            path={Routes.root}
            component={SignIn}
            attr={"login"}
            redirect={Routes.shelves}
          />
          <ProtectedRoute
            exact
            path={Routes.shelves}
            component={Shelves}
            negative
            attr={"login"}
            redirect={Routes.root}
          />
        </Switch>
      </Suspense>
    </RootProvider>
  );
}

export default App;
