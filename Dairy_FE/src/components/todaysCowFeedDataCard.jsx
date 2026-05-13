import React, { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import { useTranslation } from "react-i18next";

const TodaysCowFeedDataCard = () => {
  const { t } = useTranslation();
  const { getTodaysCowFeedDetails, todaysCowFeedData, totalCowFeedBags, totalCowFeedPrice } = useContext(AppContext);

  useEffect(() => {
    getTodaysCowFeedDetails();
  }, []);

  return (
    <div className="container d-flex flex-column gap-2 rounded shadow p-3 border border-none vh-100">
      <div className="text-center">
        <h2>
          <strong>{t("todays_cow_feed")}</strong>
        </h2>
        <h5>
          {t("total_cowfeed_bags")}: <strong>{totalCowFeedBags} Bags</strong>
        </h5>
        <h5>
          {t("total_cowfeed_price")}: <strong>₹{totalCowFeedPrice}</strong>
        </h5>
      </div>
      <div className="d-flex flex-column gap-3">
        {todaysCowFeedData?.length > 0 ? (
          todaysCowFeedData.map((data, index) => (
            <div
              key={index}
              className="d-flex w-full rounded shadow p-2 gap-1 border border-none"
            >
              <p>
                {t("farmer_name")}: <strong>{data.farmerName || "N/A"}</strong>
              </p>
              <p>
                {t("cow_feed_name")}: <strong>{data.cowFeedName || "N/A"}</strong>
              </p>
              <p>
                {t("price")}: <strong>{data.price || "N/A"}</strong>
              </p>
              <p>
                {t("allocated_bags")}: <strong>{data.allocated_bags || "N/A"}</strong>
              </p>
              <p>
                {t("total_price")}: <strong>{data.total_cowFeed_price || "N/A"}</strong>
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

export default TodaysCowFeedDataCard;
