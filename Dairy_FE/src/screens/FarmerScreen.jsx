import React, { useContext } from "react";
import UserNavbar from "../components/UserNavbar";
import FFarmerServiceCard from "../components/modals/farmerServiceCard.jsx";
import { AppContext } from "../Context/AppContext.jsx";
import { useTranslation } from "react-i18next"; // ✅ same language logic

const FarmerScreen = () => {
  const { userData } = useContext(AppContext);
  const { t } = useTranslation(); // ✅ useTranslation hook

  return (
    <div>
      <UserNavbar />
      <div className="container text-center">
        <h1>
          {t("hello")} <strong>{userData.name}</strong>,
        </h1>
        <h6>{t("welcomeBack")}</h6>
      </div>
      <FFarmerServiceCard />
    </div>
  );
};

export default FarmerScreen;
