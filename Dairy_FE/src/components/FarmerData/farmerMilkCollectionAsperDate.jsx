import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";
import { useTranslation } from "react-i18next";

const FFarmersMilkCollectionAsPerDate = () => {
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
      const { data } = await axios.post("http://localhost:4000/api/D_owner/calculate-farmers-todays-milk-price-liters", {
        D_owner_id: userData.D_owner_id,
        farmer_id: userData.id,
        date,
      });
      setLoading(false);
      if (data.success) {
        setMilkData(data.transactions);
        setTotalMilkCount(data.totalMilkCount);
        setTotalMilkPrice(data.totalMilkPrice);
      }
    } catch (error) {
      toast.error(t("failed_fetch"));
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
          <strong>{t("milk_collection")} - {date || t("select_date")}</strong>
        </h2>

        <h5 className="text-left mb-3">{t("milk_transactions")}</h5>
        {milkData.length > 0 ? (
          <div className="table-responsive p-2">
            <table className="table table-bordered table-striped table-sm">
              <thead className="table-dark">
                <tr>
                  <th>{t("name")}</th>
                  <th>{t("date")}</th>
                  <th>{t("shift")}</th>
                  <th>{t("fat")}</th>
                  <th>{t("price")}</th>
                  <th>{t("liters")}</th>
                  <th>{t("total_price")}</th>
                </tr>
              </thead>
              <tbody>
                {milkData.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.farmerName}</td>
                    <td>{new Date(tx.date).toISOString().split("T")[0]}</td>
                    <td>{tx.shift}</td>
                    <td>{tx.fat}</td>
                    <td>₹{tx.price}</td>
                    <td>{tx.liters}</td>
                    <td>₹{tx.total_value}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {t("final_total_milk_price")}: ₹{totalMilkPrice}, {t("final_total_milk_count")}: {totalMilkCount} {t("liters")}
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

export default FFarmersMilkCollectionAsPerDate;
