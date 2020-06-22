import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Header from "../header/header.component";
import ItemDetailsForm from "./item-details.form";
import TransactionsReview from "../transactions/transactions.component";

import { Container } from "../../global-styles/containers";
import { TabBox } from "./item-details.styles";

import Strings from "../../configuration/strings";

const ItemDetails = ({ headerTitle, transaction, ...OtherFormProps }) => {
  const [tab, setTab] = useState("edit");
  const { t } = useTranslation();
  const [tabWidth, setTabWidth] = useState(200);

  const changeTab = (key) => {
    setTab(key);
  };

  const editTab = () => {
    setTab("edit");
  };

  const recalculateWidth = () =>
    setTimeout(() => {
      setTabWidth(document.querySelector(".TabBox").clientWidth);
    }, 1);

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

  return (
    <>
      <Header title={headerTitle} transaction={transaction} />
      <Container tabs={true}>
        <TabBox>
          <div className="TabBox">
            <Tabs
              id="item-details-tabs"
              activeKey={tab}
              onSelect={(k) => changeTab(k)}
            >
              <Tab eventKey="edit" title={t(Strings.ItemDetails.Tabs.Edit)}>
                <div className="selection">
                  <ItemDetailsForm
                    transaction={transaction}
                    {...OtherFormProps}
                  />
                </div>
              </Tab>
              <Tab eventKey="stats" title={t(Strings.ItemDetails.Tabs.Stats)}>
                <div style={{ width: tabWidth }}>
                  <TransactionsReview
                    transaction={transaction}
                    item={OtherFormProps.item}
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
  stores: PropTypes.arrayOf(PropTypes.object).isRequired,
  shelves: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  requestTransactions: PropTypes.func,
};
