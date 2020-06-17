import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Header from "../header/header.component";
import ItemDetailsForm from "./item-details.form";

import { Paper, Container } from "../../global-styles/containers";
import { TabBox } from "./item-details.styles";

import Strings from "../../configuration/strings";

const ItemDetails = ({ headerTitle, ...FormProps }) => {
  const [tab, setTab] = useState("edit");
  const { t } = useTranslation();

  return (
    <>
      <Header title={headerTitle} transaction={FormProps.transaction} />
      <Container>
        <TabBox>
          <Tabs
            id="item-details-tabs"
            activeKey={tab}
            onSelect={(k) => setTab(k)}
          >
            <Tab eventKey="stats" title={t(Strings.ItemDetails.Tabs.Stats)}>
              <div>Unimplemented</div>
            </Tab>
            <Tab eventKey="edit" title={t(Strings.ItemDetails.Tabs.Edit)}>
              <ItemDetailsForm {...FormProps} />
            </Tab>
          </Tabs>
        </TabBox>
      </Container>
    </>
  );
};

export default ItemDetails;

ItemDetailsForm.propTypes = {
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
