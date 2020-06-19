// Package Imports
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProtectedRoute from "../../components/protected-route/protected-route.component";
import HoldingPattern from "../../components/holding-pattern/holding-pattern.component";

// Configuration
import Routes from "../../configuration/routes";

const SignIn = lazy(() => import("../signin/signin.container"));
const Shelves = lazy(() => import("../shelves/shelves.page"));
const Stores = lazy(() => import("../stores/stores.page"));
const Items = lazy(() => import("../items/items.page"));
const Details = lazy(() => import("../details/details.page"));
const Create = lazy(() => import("../create/create.page"));
const Menu = lazy(() => import("../menu/menu.page"));

function App() {
  return (
    <Suspense fallback={<HoldingPattern condition={true} />}>
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
          exact
          path={Routes.create}
          component={Create}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <ProtectedRoute
          exact
          path={Routes.root}
          component={Menu}
          negative
          attr={"login"}
          redirect={Routes.signin}
        />
        <Route render={() => <Redirect to={Routes.root} />} />
      </Switch>
    </Suspense>
  );
}

export default App;
