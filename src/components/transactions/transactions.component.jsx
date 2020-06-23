import React from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";

import HoldingPattern from "../holding-pattern/holding-pattern.component";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import { isWithinAWeek, isWithinAMonth, nextWeek } from "../../util/datetime";

import Strings from "../../configuration/strings";
import { graph } from "../../configuration/theme";

import { Paper } from "../../global-styles/containers";
import { Outline, Banner, InnerBox, PlaceHolder } from "./transactions.styles";

const TransactionsReview = ({ item, ready, tr }) => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);
  let ActivityChart;

  const renderGraph = () => {
    const labels = tr.map((o, index) => "").slice(graph.limit);
    let accumulate = item.quantity;

    const calculateQuantity = () => {
      const quantity = tr
        .reverse()
        .map((o) => {
          accumulate -= o.quantity;
          return accumulate;
        })
        .reverse();
      quantity.shift();
      quantity.push(item.quantity);
      return quantity;
    };

    /* istanbul ignore next */
    const nullFunction = () => null;

    const ctx = document.getElementById("consumptionChart").getContext("2d");
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ActivityChart = new global.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: t(Strings.ItemStats.GraphChangEvent),
            borderColor: graph.changeLine,
            data: tr
              .map((o, index) => {
                return { y: o.quantity, x: index };
              })
              .slice(graph.limit),
          },
          {
            label: t(Strings.ItemStats.GraphQuantity),
            borderColor: graph.quantityLine,
            data: calculateQuantity().slice(graph.limit),
          },
        ],
      },
      options: {
        title: {
          text: item.name,
          display: true,
        },
        legend: {
          display: false,
          generateLabels: nullFunction,
        },
        layout: {
          padding: {
            left: 0,
            right: 5,
            top: graph.topPadding,
            bottom: 0,
          },
          margin: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    ActivityChart.render();
  };

  React.useEffect(() => {
    if (tr.length < 2 || !ready) return;
    renderGraph();
    return () => {
      ActivityChart.destroy();
    };
  }, [tr, ready]);

  React.useEffect(() => {
    event(AnalyticsActions.TestAction);
  }, []);

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
    const avg = Math.abs(sum / Object.values(results).length).toFixed(1);
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
    const avg = Math.abs(sum / Object.values(results).length).toFixed(1);
    return avg;
  };

  const calculateExpired = () => {
    if (item.expired > 0) return true;
    if (
      item.next_expiry_date.isBefore(moment()) &&
      item.next_expiry_quantity > 0
    )
      return true;
    return false;
  };

  return (
    <>
      <Paper>
        <Banner className="alert alert-success mb-2">
          {t(Strings.ItemStats.Title)}
        </Banner>
        {calculateExpired() ? (
          <Banner className="alert alert-danger mb-2">
            {t(Strings.ItemStats.RecommendExpiredItems)}
          </Banner>
        ) : null}
        {nextWeek(item.next_expiry_date) && item.next_expiry_quantity > 0 ? (
          <Banner className="alert alert-warning mb-2">
            {`${item.next_expiry_quantity} ${t(
              Strings.ItemStats.RecommendExpiringSoon
            )}`}
          </Banner>
        ) : null}
        <Outline>
          <InnerBox>
            <HoldingPattern
              condition={!ready}
              color={graph.holdingPatternColor}
              animation={graph.holdingPatternAnimation}
              height={graph.holdingPatternHeight}
              scale={graph.holdingPatternScale}
              divHeight={graph.holdingPatternDivHeight}
            >
              {tr.length > 1 ? (
                <div className="chartBox">
                  <canvas id="consumptionChart"></canvas>
                </div>
              ) : (
                <PlaceHolder className="text-muted">
                  <div>{t(Strings.ItemStats.NotEnoughData)}</div>
                </PlaceHolder>
              )}
            </HoldingPattern>
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

TransactionsReview.propTypes = {
  item: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
  tr: PropTypes.arrayOf(PropTypes.object).isRequired,
};
