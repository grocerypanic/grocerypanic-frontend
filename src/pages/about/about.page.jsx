import React from "react";
import Dialogue from "../../components/dialogue/dialogue.component";
import FeedBack from "../../components/feedback/feedback.component";

import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Dialogue
      title={t("AboutPage.Title")}
      headerTitle={t("AboutPage.HeaderTitle")}
      body={t("AboutPage.Body")}
      Footer={FeedBack}
    />
  );
};

export default AboutPage;
