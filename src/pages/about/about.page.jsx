import React from "react";
import Dialogue from "../../components/dialogue/dialogue.component";
import FeedBack from "../../components/feedback/feedback.component";

import { useTranslation } from "react-i18next";
import Strings from "../../configuration/strings";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Dialogue
      title={t(Strings.AboutPage.Title)}
      headerTitle={t(Strings.AboutPage.HeaderTitle)}
      body={t(Strings.AboutPage.Body)}
      Footer={FeedBack}
    />
  );
};

export default AboutPage;
