import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';
import { useTranslation } from "react-i18next";

const FarmersTodayCowFeed = ({ currentIndex }) => {
  const { t } = useTranslation();
  const { farmersData, userData, backendUrl } = useContext(AppContext);
  const [cowFeedTransactions, setCowFeedTransactions] = useState([]);
  const [total_CowFeedPrice, setTotal_CowFeedPrice] = useState(0);
  const [total_CowFeedBags, setTotal_CowFeedBags] = useState(0);

  useEffect(() => {
    if (!farmersData || !farmersData[currentIndex]) return;

    const getTodaysMilkCollection = async () => {
      try {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);
        const date = istTime.toISOString().split("T")[0];

        const response = await axios.post(
          `${backendUrl}/api/D_owner/calculate-farmers-todays-cowFeed-price-bags`,
          {
            farmer_id: farmersData[currentIndex]._id,
            date,
            D_owner_id: userData.id,
          }
        );

        if (response.data.success) {
          setCowFeedTransactions(response.data.transactions);
          setTotal_CowFeedPrice(response.data.totalcowFeedPrice);
          setTotal_CowFeedBags(response.data.totalAllocatedBags);
        }
      } catch (error) {
        toast.error(error.message || t("error_fetching_data"));
      }
    };

    getTodaysMilkCollection();
  }, [currentIndex, farmersData, backendUrl, userData, t]);

  if (!farmersData || !farmersData[currentIndex]) {
    return <p className="text-danger">{t("error_no_farmer_data")}</p>;
  }

  return (
    <div>
      <h5 className="text-left mb-3">{t("cow_feed_transactions")}</h5>
      {cowFeedTransactions.length > 0 ? (
        <div className="table-responsive p-2">
          <table className="table table-bordered table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>
                  {t("date")}
                </th>
                <th style={{ width: "25%", whiteSpace: "nowrap" }}>
                  {t("feed_name")}
                </th>
                <th style={{ width: "10%", whiteSpace: "nowrap" }}>
                  {t("bags")}
                </th>
                <th style={{ width: "15%", whiteSpace: "nowrap" }}>
                  {t("price")}
                </th>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>
                  {t("total_value")}
                </th>
              </tr>
            </thead>
            <tbody>
              {cowFeedTransactions.map((tx, index) => {
                const formattedDate = new Date(tx.date)
                  .toISOString()
                  .split("T")[0];
                return (
                  <tr key={index}>
                    <td>{formattedDate}</td>
                    <td>{tx.cowFeedName}</td>
                    <td>{tx.allocated_bags}</td>
                    <td>₹{tx.price}</td>
                    <td>₹{tx.total_cowFeed_price}</td>
                  </tr>
                );
              })}
              <tr>
                <td
                  colSpan="5"
                  className="border border-1 p-2"
                  style={{
                    height: "50px",
                    fontWeight: "bold",
                    textAlign: "left",
                    fontSize: "16px",
                  }}
                >
                  {t("final_total_feed_price")}: ₹{total_CowFeedPrice},{" "}
                  {t("final_total_feed_bags")}: {total_CowFeedBags}{" "}
                  {t("bags")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">{t("no_transactions_found")}</p>
      )}
    </div>
  );
};

export default FarmersTodayCowFeed;
