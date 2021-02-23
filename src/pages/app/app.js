// Package Imports
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { HeaderContext } from "../../providers/header/header.provider";

import Consent from "../../components/consent/consent.component";
import ProtectedRoute from "../../components/protected-route/protected-route.component";
import HoldingPattern from "../../components/holding-pattern/holding-pattern.component";
import Header from "../../components/header/header.component";

// Configuration
import Routes from "../../configuration/routes";

const About = lazy(() => import("../about/about.page"));
const Create = lazy(() => import("../create/create.page"));
const Details = lazy(() => import("../details/details.page"));
const Items = lazy(() => import("../items/items.page"));
const Menu = lazy(() => import("../menu/menu.page"));
const Privacy = lazy(() => import("../privacy/privacy.page"));
const SignIn = lazy(() => import("../signin/signin.container"));
const Shelves = lazy(() => import("../shelves/shelves.page"));
const Splash = lazy(() => import("../splash/splash.page"));
const Stores = lazy(() => import("../stores/stores.page"));

function App() {
  const { updateHeader } = React.useContext(HeaderContext);

  React.useEffect(() => {
    updateHeader({
      title: "MainHeaderTitle",
      disableNav: true,
    });
  }, []); // eslint-disable-line

  return (
    <>
      <Header />
      <Suspense fallback={<HoldingPattern condition={true} />}>
        <Switch>
          <ProtectedRoute
            exact
            path={Routes.signin}
            component={SignIn}
            attr={"login"}
            redirect={Routes.menu}
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
            path={Routes.about}
            component={About}
            negative
            attr={"login"}
            redirect={Routes.signin}
          />
          <ProtectedRoute
            exact
            path={Routes.menu}
            component={Menu}
            negative
            attr={"login"}
            redirect={Routes.signin}
          />
          <ProtectedRoute
            exact
            path={Routes.splash}
            component={Splash}
            attr={"login"}
            redirect={Routes.menu}
          />
          <Route exact path={Routes.privacy} component={Privacy} />
          <Route render={() => <Redirect to={Routes.menu} />} />
        </Switch>
        <Consent />
      </Suspense>
    </>
  );
}

export default App;
