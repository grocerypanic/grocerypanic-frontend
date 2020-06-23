import React from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Strings from "../../configuration/strings";

import { Paper } from "../../global-styles/containers";
import { Outline, Banner, InnerBox, PlaceHolder } from "./transactions.styles";

const GraphLimit = -50;

const TransactionsReview = ({ item, transaction, tr }) => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);

  const renderGraph = () => {
    const labels = tr.map((o, index) => "");

    /* istanbul ignore next */
    const nullFunction = () => null;

    const ctx = document.getElementById("myChart").getContext("2d");
    const chart = new global.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Change Event",
            borderColor: "rgb(92, 184, 92)",
            data: tr
              .map((o, index) => {
                return { y: o.quantity, x: index };
              })
              .slice(GraphLimit),
          },
        ],
      },
      options: {
        title: {
          display: false,
        },
        legend: {
          display: false,
          generateLabels: nullFunction,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 25,
            bottom: 0,
          },
          margin: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    chart.render();
  };

  React.useEffect(() => {
    if (tr.length === 0) return;
    renderGraph();
  }, [tr]);

  React.useEffect(() => {
    event(AnalyticsActions.TestAction);
  }, []);

  const isWithinAWeek = (dateObject) => {
    return dateObject.isAfter(moment().subtract(7, "days").startOf("day"));
  };

  const isWithinAMonth = (dateObject) => {
    return dateObject.isAfter(moment().subtract(1, "months").startOf("day"));
  };

  const consumedWithinLastWeek = () => {
    const results = tr.filter((o) => o.quantity < 0 && isWithinAWeek(o.date));
    return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
  };

  const consumedWithinLastMonth = () => {
    const results = tr.filter((o) => o.quantity < 0 && isWithinAMonth(o.date));
    return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
  };

  const averageWeeklyConsumption = () => {
    const results = {};
    tr.forEach((o) => {
      if (o.quantity > 0) return;
      const header = String(o.date.isoWeekYear()) + String(o.date.isoWeek());
      if (results[header]) {
        results[header] += o.quantity;
      } else {
        results[header] = o.quantity;
      }
    });
    if (Object.values(results).length === 0) return 0;
    const sum = Object.values(results).reduce((a, b) => a + b, 0);
    const avg = Math.abs(sum / Object.values(results).length);
    return avg;
  };

  const averageMonthlyConsumption = () => {
    const results = {};
    tr.forEach((o) => {
      if (o.quantity > 0) return;
      const header = String(o.date.year()) + String(o.date.month());
      if (results[header]) {
        results[header] += o.quantity;
      } else {
        results[header] = o.quantity;
      }
    });
    if (Object.values(results).length === 0) return 0;
    const sum = Object.values(results).reduce((a, b) => a + b, 0);
    const avg = Math.abs(sum / Object.values(results).length);
    return avg;
  };

  return (
    <>
      <Paper>
        <Banner className="alert alert-success">
          {t(Strings.ItemStats.Title)}
        </Banner>
        {item.expired === 0 ? null : (
          <Banner className="alert alert-danger">
            {t(Strings.ItemStats.RecommendExpiredItems)}
          </Banner>
        )}
        {isWithinAWeek(item.next_expiry_date) &&
        item.next_expiry_quantity > 0 ? (
          <Banner className="alert alert-warning">
            {`${item.next_expiry_quantity} ${t(
              Strings.ItemStats.RecommendExpiringSoon
            )}`}
          </Banner>
        ) : null}
        <Outline>
          <InnerBox>
            {tr.length > 0 ? (
              <div className="chartBox">
                <canvas id="myChart"></canvas>
              </div>
            ) : (
              <PlaceHolder className="text-muted">
                <div>{t(Strings.ItemStats.NotEnoughData)}</div>
              </PlaceHolder>
            )}
          </InnerBox>
          <InnerBox>
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td>{t(Strings.ItemStats.ConsumptionCurrentInventory)}</td>
                  <td>{item.quantity}</td>
                </tr>
                <tr>
                  <td>{t(Strings.ItemStats.ConsumptionConsumedLastWeek)}</td>
                  <td data-testid="lastWeek">{consumedWithinLastWeek()}</td>
                </tr>
                <tr>
                  <td>{t(Strings.ItemStats.ConsumptionConsumedLastMonth)}</td>
                  <td data-testid="lastMonth">{consumedWithinLastMonth()}</td>
                </tr>
                <tr>
                  <td>{t(Strings.ItemStats.ConsumptionAvgWeek)}</td>
                  <td data-testid="avgWeek">{averageWeeklyConsumption()}</td>
                </tr>
                <tr>
                  <td>{t(Strings.ItemStats.ConsumptionAvgMonth)}</td>
                  <td data-testid="avgMonth">{averageMonthlyConsumption()}</td>
                </tr>
              </tbody>
            </Table>
          </InnerBox>
        </Outline>
      </Paper>
    </>
  );
};

export default TransactionsReview;
