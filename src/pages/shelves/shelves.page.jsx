import React from "react";

import SimpleList from "../../components/simple-list/simple-list.component";

import { ShelfContext } from "../../providers/api/shelf/shelf.provider";

import { useTranslation } from "react-i18next";
import Strings from "../../configuration/strings";

const ShelvesPage = () => {
  const { t } = useTranslation();

  return (
    <SimpleList
      title={t(Strings.ShelfPageTitle)}
      headerTitle={t(Strings.ShelfPageHeaderTitle)}
      ApiObjectContext={ShelfContext}
    />
  );
};

export default ShelvesPage;
