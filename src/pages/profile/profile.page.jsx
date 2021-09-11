import React from "react";
import { useTranslation } from "react-i18next";
import UserProfileEditContainer from "../../components/profile/profile.edit.container";
import Options from "../../configuration/menu";

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <UserProfileEditContainer
      options={Options}
      title={t("Profile.Title")}
      headerTitle={t("Profile.HeaderTitle")}
      helpText={t("Profile.HelpText")}
    />
  );
};

export default ProfilePage;
