import React from "react";
import { useTranslation } from "react-i18next";
import Dialogue from "../../components/dialogue/dialogue.component";
import FeedBack from "../../components/feedback/feedback.component";

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
