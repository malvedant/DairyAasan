import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

const CowFeedAllocationAsPerDateCard = () => {
  const { t } = useTranslation();
  const { userData } = useContext(AppContext);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [cowFeedData, setCowFeedData] = useState([]);
  const [totalCowFeedBags, setTotalCowFeedBags] = useState(0);
  const [totalCowFeedPrice, setTotalCowFeedPrice] = useState(0);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/D_owner/get-All-cowfeed-transactions-asper-date",
        { D_owner_id: userData.id, date }
      );

      if (data.success) {
        await calculatedTotalCowFeedAndPrice();
        toast.success(data.message);
        setCowFeedData(data.data);
      } else {
        toast.error(t("no_cowfeed_data"));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatedTotalCowFeedAndPrice = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/D_owner/calculate-todays-cowFeed-price-bags",
        { D_owner_id: userData.id, date }
      );
      if (data.success) {
        setTotalCowFeedBags(data.totalAllocatedBags);
        setTotalCowFeedPrice(data.totalcowFeedPrice);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container min-vh-100">
      {/* Date Input Field */}
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
          {loading ? "Loading..." : t("search")}
        </button>
      </div>

      {/* Cow Feed Collection Data */}
      <div className="container p-3">
        <h2 className="text-center">
          <strong>
            {t("cow_feed_allocation")} - {date || t("select_date")}
          </strong>
        </h2>
        <h5>
          {t("total_cowfeed_bags")}: <strong>{totalCowFeedBags} Bags</strong>
        </h5>
        <h5>
          {t("total_cowfeed_price")}: <strong>₹{totalCowFeedPrice}</strong>
        </h5>
        <div className="d-flex flex-column gap-3">
          {cowFeedData.length > 0 ? (
            cowFeedData.map((data, index) => (
              <div
                key={index}
                className="d-flex w-full rounded shadow p-2 gap-1 border border-none"
              >
                <p>
                  {t("farmer_name")}: <strong>{data.farmerName || "N/A"}</strong>
                </p>
                <p>
                  {t("cowfeed_name")}: <strong>{data.cowFeedName || "N/A"}</strong>
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
            <p>{t("no_cowfeed_data")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CowFeedAllocationAsPerDateCard;
