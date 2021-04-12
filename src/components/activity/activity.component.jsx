import React from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";

import HoldingPattern from "../holding-pattern/holding-pattern.component";

import { within7Days } from "../../util/datetime";

import { renderChart } from "./activity.chart";
import { graph } from "../../configuration/theme";

import { Paper } from "../../global-styles/containers";
import { Banner } from "../../global-styles/banner";
import { Outline, InnerBox } from "./activity.styles";

export const nullReport = {
  id: null,
  activity_first: null,
  usage_total: null,
  usage_avg_week: null,
  usage_avg_month: null,
  recent_activity: {
    user_timezone: null,
    usage_current_week: null,
    usage_current_month: null,
    activity_last_two_weeks: [],
  },
};

const ActivityReport = ({ item, activity_report }) => {
  const { t } = useTranslation();
  const ActivityChart = React.useRef();

  // state for activity

  React.useEffect(() => {
    if (!ready()) return;
    ActivityChart.current = renderChart(
      t,
      activity_report.recent_activity.activity_last_two_weeks,
      item
    ); // eslint-disable-line
    return () => {
      ActivityChart.current.destroy();
    };
  }, [activity_report]); // eslint-disable-line

  const calculateExpired = () => {
    if (item.expired > 0) return true;
    if (
      item.next_expiry_date.isBefore(moment()) &&
      item.next_expiry_quantity > 0
    )
      return true;
    return false;
  };

  const ready = () =>
    activity_report.recent_activity.activity_last_two_weeks.length > 0;

  return (
    <>
      <Paper>
        <Banner className="alert alert-success mb-2">
          {t("ItemActivity.Title")}
        </Banner>
        {calculateExpired() ? (
          <Banner className="alert alert-danger mb-2">
            {t("ItemActivity.RecommendExpiredItems")}
          </Banner>
        ) : null}
        {within7Days(item.next_expiry_date) && item.next_expiry_quantity > 0 ? (
          <Banner className="alert alert-warning mb-2">
            {`${item.next_expiry_quantity} ${t(
              "ItemActivity.RecommendExpiringSoon"
            )}`}
          </Banner>
        ) : null}
        <Outline>
          <InnerBox>
            <HoldingPattern
              condition={!ready()}
              color={graph.holdingPatternColor}
              animation={graph.holdingPatternAnimation}
              height={graph.holdingPatternHeight}
              scale={graph.holdingPatternScale}
              divHeight={graph.holdingPatternDivHeight}
            >
              <div className="chartBox">
                <canvas id="consumptionChart"></canvas>
              </div>
            </HoldingPattern>
          </InnerBox>
          <InnerBox>
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td>{t("ItemActivity.ConsumptionCurrentInventory")}</td>
                  <td>{item.quantity}</td>
                </tr>
                <tr>
                  <td>{t("ItemActivity.ConsumptionConsumedThisWeek")}</td>
                  <td data-testid="thisWeek">
                    {activity_report.recent_activity.usage_current_week}
                  </td>
                </tr>
                <tr>
                  <td>{t("ItemActivity.ConsumptionConsumedThisMonth")}</td>
                  <td data-testid="thisMonth">
                    {activity_report.recent_activity.usage_current_month}
                  </td>
                </tr>
                <tr>
                  <td>{t("ItemActivity.ConsumptionConsumedAvgWeek")}</td>
                  <td data-testid="avgWeek">
                    {activity_report.usage_avg_week}
                  </td>
                </tr>
                <tr>
                  <td>{t("ItemActivity.ConsumptionConsumedAvgMonth")}</td>
                  <td data-testid="avgMonth">
                    {activity_report.usage_avg_month}
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

export default ActivityReport;

ActivityReport.propTypes = {
  item: PropTypes.object.isRequired,
  activity_report: PropTypes.object.isRequired,
};
