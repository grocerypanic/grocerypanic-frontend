import React from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Strings from "../../configuration/strings";

const PlaceHolder = () => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);

  React.useEffect(() => {
    event(AnalyticsActions.TestAction);
  }, []);

  return <div>{t(Strings.PlaceHolder.PlaceHolderMessage)}</div>;
};

export default PlaceHolder;
