import React from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Strings from "../../configuration/strings";

import { Paper } from "../../global-styles/containers";
import { Outline, Banner, InnerBox, Title } from "./transactions.styles";

const TransactionsReview = ({ title, item, transaction, tr }) => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [nameState, setNameState] = React.useState(item.name);

  React.useEffect(() => {
    event(AnalyticsActions.TestAction);
  }, []);

  return (
    <>
      <Paper>
        {errorMsg ? (
          <Banner className="alert alert-danger">{errorMsg}</Banner>
        ) : (
          <Banner className="alert alert-success">
            {t(Strings.ItemStats.Title)}
          </Banner>
        )}
        <Outline>
          <InnerBox>
            <Title>{item.name}</Title>
          </InnerBox>
        </Outline>
      </Paper>
    </>
  );
};

export default TransactionsReview;
