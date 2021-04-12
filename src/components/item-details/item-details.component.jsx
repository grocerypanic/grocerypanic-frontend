import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import ItemDetailsForm from "../item-details-form/item-details-form.component";
import ActivityReport, { nullReport } from "../activity/activity.component";
import { HeaderContext } from "../../providers/header/header.provider";

import { Container } from "../../global-styles/containers";
import { TabBox } from "./item-details.styles";

const ItemDetails = ({
  headerTitle,
  transaction,
  activity,
  activityStatus,
  requestActivityReport,
  ...OtherFormProps
}) => {
  const [tab, setTab] = useState("edit");
  const { t } = useTranslation();
  const [tabWidth, setTabWidth] = useState(200);
  const { updateHeader } = React.useContext(HeaderContext);
  const [report, setReport] = React.useState(nullReport);

  const changeTab = (key) => {
    setTab(key);
    if (key === "stats") requestActivityReport();
  };

  const editTab = () => {
    setTab("edit");
  };

  const recalculateWidth = () =>
    setTabWidth(document.querySelector(".TabBox").clientWidth);

  React.useLayoutEffect(() => {
    recalculateWidth();
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", recalculateWidth);
    window.addEventListener("orientationchange", editTab);
    return () => {
      window.removeEventListener("resize", recalculateWidth);
      window.removeEventListener("orientationchange", editTab);
    };
  }, []);

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: null,
      transaction: transaction,
      disableNav: false,
    });
  }, [transaction]); // eslint-disable-line

  React.useEffect(() => {
    if (activity.length > 0) {
      const fetched_report = activity.find(
        (o) => o.id === OtherFormProps.item.id
      );
      if (fetched_report) setReport(fetched_report);
    }
  }, [activity, OtherFormProps.item]);

  return (
    <>
      <Container tabs={true}>
        <TabBox>
          <div className="TabBox">
            <Tabs
              id="item-details-tabs"
              activeKey={tab}
              onSelect={(k) => changeTab(k)}
            >
              <Tab eventKey="edit" title={t("ItemDetails.Tabs.Edit")}>
                <div className="selection">
                  <ItemDetailsForm
                    transaction={transaction}
                    {...OtherFormProps}
                  />
                </div>
              </Tab>
              <Tab eventKey="stats" title={t("ItemDetails.Tabs.Stats")}>
                <div style={{ width: tabWidth }}>
                  <ActivityReport
                    item={OtherFormProps.item}
                    activity_report={report}
                  />
                </div>
              </Tab>
            </Tabs>
          </div>
        </TabBox>
      </Container>
    </>
  );
};

export default ItemDetails;

ItemDetails.propTypes = {
  allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  item: PropTypes.object.isRequired,
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  transaction: PropTypes.bool.isRequired,
  activity: PropTypes.arrayOf(PropTypes.object).isRequired,
  activityStatus: PropTypes.bool.isRequired,
  stores: PropTypes.arrayOf(PropTypes.object).isRequired,
  shelves: PropTypes.arrayOf(PropTypes.object).isRequired,
  requestActivityReport: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  duplicate: PropTypes.bool.isRequired,
  setDuplicate: PropTypes.func.isRequired,
};
