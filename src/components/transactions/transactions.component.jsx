import React from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";

import HoldingPattern from "../holding-pattern/holding-pattern.component";

import { within7Days } from "../../util/datetime";
import {
  consumedWithinThisWeek,
  consumedWithinThisMonth,
  consumedInLastWeek,
  consumedInLastMonth,
} from "../../util/consumption";

import { renderChart } from "./transaction.chart";
import { graph } from "../../configuration/theme";

import { Paper } from "../../global-styles/containers";
import { Banner } from "../../global-styles/banner";
import { Outline, InnerBox, PlaceHolder } from "./transactions.styles";

const TransactionsReview = ({ item, ready, tr }) => {
  const { t } = useTranslation();

  let ActivityChart;

  React.useEffect(() => {
    if (tr.length < 1 || !ready) return;
    ActivityChart = renderChart(t, tr, item); // eslint-disable-line
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
        {within7Days(item.next_expiry_date) && item.next_expiry_quantity > 0 ? (
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
              {tr.length > 0 ? (
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
                  <td>{t("ItemStats.ConsumptionConsumedThisWeek")}</td>
                  <td data-testid="thisWeek">{consumedWithinThisWeek(tr)}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionConsumedLastWeek")}</td>
                  <td data-testid="lastWeek">{consumedInLastWeek(tr)}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionConsumedThisMonth")}</td>
                  <td data-testid="thisMonth">{consumedWithinThisMonth(tr)}</td>
                </tr>
                <tr>
                  <td>{t("ItemStats.ConsumptionConsumedLastMonth")}</td>
                  <td data-testid="lastMonth">{consumedInLastMonth(tr)}</td>
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
