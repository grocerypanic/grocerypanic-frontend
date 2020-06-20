import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Header from "../header/header.component";
import ItemDetailsForm from "./item-details.form";

import { Container } from "../../global-styles/containers";
import { TabBox } from "./item-details.styles";

import Strings from "../../configuration/strings";

const ItemDetails = ({ headerTitle, transaction, ...OtherFormProps }) => {
  const [tab, setTab] = useState("edit");
  const { t } = useTranslation();

  const changeTab = (key) => {
    if (transaction) return;
    setTab(key);
  };

  return (
    <>
      <Header title={headerTitle} transaction={transaction} />
      <Container tabs={true}>
        <TabBox>
          <Tabs
            id="item-details-tabs"
            activeKey={tab}
            onSelect={(k) => changeTab(k)}
          >
            <Tab eventKey="stats" title={t(Strings.ItemDetails.Tabs.Stats)}>
              <div>Unimplemented</div>
            </Tab>
            <Tab eventKey="edit" title={t(Strings.ItemDetails.Tabs.Edit)}>
              <ItemDetailsForm transaction={transaction} {...OtherFormProps} />
            </Tab>
          </Tabs>
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
};
