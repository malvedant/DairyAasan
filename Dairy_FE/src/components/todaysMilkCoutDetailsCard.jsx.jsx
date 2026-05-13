import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useTranslation } from "react-i18next";

const TodaysMilkCountDetailsCard = () => {
  const { t } = useTranslation();
  const { getTodaysMilkCountDetails, todaysMilkData } = useContext(AppContext);
  const [milkData, setMilkData] = useState([]);

  useEffect(() => {
    getTodaysMilkCountDetails();
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("todaysMilkData");
    if (storedData) {
      setMilkData(JSON.parse(storedData));
    }
  }, [todaysMilkData]);

  return (
    <div className="container d-flex flex-column gap-2 rounded shadow p-3 border border-none vh-100">
      <div className="text-center">
        <h2>
          <strong>{t("todays_milk_count")}</strong>
        </h2>
      </div>
      <div className="d-flex flex-column gap-3">
        {milkData?.length > 0 ? (
          milkData.map((data, index) => (
            <div
              key={index}
              className="d-flex w-full rounded shadow p-2 gap-1 border border-none"
            >
              <p>
                {t("name")}: <strong>{data.farmerName || "N/A"}</strong>
              </p>
              <p>
                {t("fat")}: <strong>{data.fat || "N/A"}</strong>
              </p>
              <p>
                {t("price")}: <strong>{data.price || "N/A"}</strong>
              </p>
              <p>
                {t("liters")}: <strong>{data.liters || "N/A"}</strong>
              </p>
              <p>
                {t("total_price")}: <strong>{data.total_value || "N/A"}</strong>
              </p>
              <p>
                {t("shift")}: <strong>{data.shift || "N/A"}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>{t("no_data")}</p>
        )}
      </div>
    </div>
  );
};

export default TodaysMilkCountDetailsCard;
