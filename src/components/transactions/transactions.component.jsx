import React from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";

import HoldingPattern from "../holding-pattern/holding-pattern.component";

import { nextWeek } from "../../util/datetime";
import {
  consumedWithinLastWeek,
  consumedWithinLastMonth,
  averageWeeklyConsumption,
  averageMonthlyConsumption,
} from "../../util/consumption";

import { Constants } from "../../configuration/backend";
import { graph } from "../../configuration/theme";

import { Paper } from "../../global-styles/containers";
import { Banner } from "../../global-styles/banner";
import { Outline, InnerBox, PlaceHolder } from "./transactions.styles";

const TransactionsReview = ({ item, ready, tr }) => {
  const { t } = useTranslation();
  let ActivityChart;

  const renderGraph = () => {
    const labels = tr.map((o) => "").slice(Constants.maximumTransactions * -1);
    let accumulate = item.quantity;

    const calculateQuantity = () => {
      const quantity = tr
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
            label: t("ItemStats.GraphChangEvent"),
            borderColor: graph.changeLine,
            data: tr
              .map((o, index) => {
                return { y: o.quantity, x: index };
              })
              .slice(Constants.maximumTransactions * -1)
              .reverse(),
          },
          {
            label: t("ItemStats.GraphQuantity"),
            borderColor: graph.quantityLine,
            data: calculateQuantity().slice(Constants.maximumTransactions * -1),
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
  }, [tr, ready]); // eslint-disable-line

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
          {t("ItemStats.Title")}
        </Banner>
        {calculateExpired() ? (
          <Banner className="alert alert-danger mb-2">
            {t("ItemStats.RecommendExpiredItems")}
          </Banner>
        ) : null}
        {nextWeek(item.next_expiry_date) && item.next_expiry_quantity > 0 ? (
          <Banner className="alert alert-warning mb-2">
            {`${item.next_expiry_quantity} ${t(
              "ItemStats.RecommendExpiringSoon"
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
                  <div>{t("ItemStats.NotEnoughData")}</div>
                </PlaceHolder>
              )}
            </HoldingPattern>
          </InnerBox>
          <InnerBox>
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td>{t("ItemStats.ConsumptionCurrentInventory")}</td>
                  <td>{item.quantity}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionConsumedLastWeek")}</td>
                  <td data-testid="lastWeek">{consumedWithinLastWeek(tr)}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionConsumedLastMonth")}</td>
                  <td data-testid="lastMonth">{consumedWithinLastMonth(tr)}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionAvgWeek")}</td>
                  <td data-testid="avgWeek">{averageWeeklyConsumption(tr)}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionAvgMonth")}</td>
                  <td data-testid="avgMonth">
                    {averageMonthlyConsumption(tr)}
                  </td>
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
