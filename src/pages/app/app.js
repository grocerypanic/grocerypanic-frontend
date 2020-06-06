// Package Imports
import React, { Suspense, lazy } from "react";
import { Switch, DefaultRoute } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ProtectedRoute from "../../components/protected-route/protected-route.component";

// Configuration
import Routes from "../../configuration/routes";
import Strings from "../../configuration/strings";

const SignIn = lazy(() => import("../signin/signin.container"));
const Shelves = lazy(() => import("../shelves/shelves.page"));
const Stores = lazy(() => import("../stores/stores.page"));
const Items = lazy(() => import("../items/items.page"));
const Details = lazy(() => import("../details/details.page"));
const Menu = lazy(() => import("../menu/menu.page"));

function App() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t(Strings.App.Suspense)}</div>}>
      <Switch>
        <ProtectedRoute
          exact
          path={Routes.signin}
          component={SignIn}
          attr={"login"}
          redirect={Routes.root}
        />
        <ProtectedRoute
          exact
          path={Routes.shelves}
          component={Shelves}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <ProtectedRoute
          exact
          path={Routes.stores}
          component={Stores}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <ProtectedRoute
          exact
          path={Routes.items}
          component={Items}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <ProtectedRoute
          path={Routes.details}
          component={Details}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <ProtectedRoute
          path={Routes.root}
          component={Menu}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <ProtectedRoute
          path={""}
          component={() => <div></div>}
          negative
          attr={"error"}
          redirect={Routes.root}
        />
      </Switch>
    </Suspense>
  );
}

export default App;
