import React from "react";
import { useTranslation } from "react-i18next";
import Dialogue from "../../components/dialogue/dialogue.component";
import FeedBack from "../../components/feedback/feedback.component";

const PrivacyPage = () => {
  const [policy, setPolicy] = React.useState("");
  const { t } = useTranslation();

  React.useEffect(() => {
    if (policy !== "") return;
    fetch(t("PrivacyPage.PolicyFile"))
      .then((response) => response.text())
      .then((policyData) => setPolicy(policyData));
  }, [policy]); // eslint-disable-line

  return (
    <Dialogue
      title={t("PrivacyPage.Title")}
      headerTitle={t("PrivacyPage.HeaderTitle")}
      body={policy}
      Footer={FeedBack}
    />
  );
};

export default PrivacyPage;
