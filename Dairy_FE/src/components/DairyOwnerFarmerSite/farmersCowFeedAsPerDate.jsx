import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";
import { useTranslation } from "react-i18next";

const FarmersCowFeedAsPerDate = ({ currentIndex }) => {
  const { userData, farmersData } = useContext(AppContext);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [cowFeedData, setCowFeedData] = useState([]);
  const [totalCowFeedBags, setTotalCowFeedBags] = useState(0);
  const [totalCowFeedPrice, setTotalCowFeedPrice] = useState(0);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/D_owner/calculate-farmers-todays-cowFeed-price-bags",
        {
          D_owner_id: userData.id,
          farmer_id: farmersData[currentIndex]._id,
          date,
        }
      );
      setLoading(false);
      if (data.success) {
        setCowFeedData(data.transactions);
        setTotalCowFeedBags(data.totalAllocatedBags);
        setTotalCowFeedPrice(data.totalcowFeedPrice);
      }
    } catch (error) {
      toast.error(error.message || t("error_fetch"));
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100">
      <div className="form-floating mb-3">
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="date">{t("select_date")}</label>
      </div>

      {/* Search Button */}
      <div className="text-center my-2">
        <button
          id="submitButton"
          className="btn btn-success w-75"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("loading") : t("search")}
        </button>
      </div>

      {/* Cow Feed Data */}
      <div className="container p-3">
        <h2 className="text-center">
          <strong>
            {t("cow_feed_transaction")} - {date || t("select_date")}
          </strong>
        </h2>

        <h5 className="text-left mb-3">{t("cow_feed_transactions")}</h5>
        {cowFeedData.length > 0 ? (
          <div className="table-responsive p-2">
            <table className="table table-bordered table-striped table-sm">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("name")}</th>
                  <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("date")}</th>
                  <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("feed_name")}</th>
                  <th style={{ width: "10%", whiteSpace: "nowrap" }}>{t("bags")}</th>
                  <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("price")}</th>
                  <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("total_value")}</th>
                </tr>
              </thead>
              <tbody>
                {cowFeedData.map((tx, index) => {
                  const formattedDate = new Date(tx.date).toISOString().split("T")[0];
                  return (
                    <tr key={index}>
                      <td>{tx.farmerName}</td>
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
                    colSpan="6"
                    className="border border-1 p-2"
                    style={{
                      height: "50px",
                      fontWeight: "bold",
                      textAlign: "left",
                      fontSize: "16px",
                    }}
                  >
                    {t("final_total")} ₹{totalCowFeedPrice}, {t("final_bags")}{" "}
                    {totalCowFeedBags} {t("bags_label")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted">{t("no_transactions")}</p>
        )}
      </div>
    </div>
  );
};

export default FarmersCowFeedAsPerDate;
