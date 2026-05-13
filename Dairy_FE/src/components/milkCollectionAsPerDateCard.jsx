import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

const MilkCollectionAsPerDateCard = () => {
  const { t } = useTranslation();
  const { userData } = useContext(AppContext);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [milkData, setMilkData] = useState([]);
  const [totalMilkCount, setTotalMilkCount] = useState(0);
  const [totalMilkPrice, setTotalMilkPrice] = useState(0);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/D_owner/get-All-milk-transactions-asper-date",
        { D_owner_id: userData.id, date }
      );

      if (data.success) {
        await calculatedTotalMilkCountAndPrice();
        toast.success(data.message);
        setMilkData(data.data);
      } else {
        toast.error(t("no_data_date"));
      }
    } catch (error) {
      toast.error(error.message || t("failed_fetch"));
    } finally {
      setLoading(false);
    }
  };

  const calculatedTotalMilkCountAndPrice = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/D_owner/calculate-todays-milk-price-liters",
        { D_owner_id: userData.id, date }
      );
      if (data.success) {
        setTotalMilkCount(data.totalMilkCount);
        setTotalMilkPrice(data.totalMilkPrice);
      }
    } catch (error) {
      toast.error(error.message || t("failed_fetch"));
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
          {loading ? t("loading") : t("search")}
        </button>
      </div>

      {/* Milk Collection Data */}
      <div className="container p-3">
        <h2 className="text-center">
          <strong>
            {t("milk_collection")} - {date || t("select_date")}
          </strong>
        </h2>

        <h5>
          {t("total_milk")}: <strong>{totalMilkCount} Liters</strong>
        </h5>
        <h5>
          {t("total_milk_price")}: <strong>₹{totalMilkPrice}</strong>
        </h5>

        <div className="d-flex flex-column gap-3">
          {milkData.length > 0 ? (
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
    </div>
  );
};

export default MilkCollectionAsPerDateCard;
