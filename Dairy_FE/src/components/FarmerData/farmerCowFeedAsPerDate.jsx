import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";
import { useTranslation } from 'react-i18next';

const FFarmersCowFeedAsPerDate = () => {
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
      const { data } = await axios.post("http://localhost:4000/api/D_owner/calculate-farmers-todays-cowFeed-price-bags", {
        D_owner_id: userData.D_owner_id,
        farmer_id: userData.id,
        date,
      });
      setLoading(false);
      if (data.success) {
        setCowFeedData(data.transactions);
        setTotalCowFeedBags(data.totalAllocatedBags);
        setTotalCowFeedPrice(data.totalcowFeedPrice);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || t('failed_fetch'));
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
        <label htmlFor="date">{t('select_date')}</label>
      </div>

      <div className="text-center my-2">
        <button
          id="submitButton"
          className="btn btn-success w-75"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t('loading') : t('search')}
        </button>
      </div>

      <div className="container p-3">
        <h2 className="text-center">
          <strong>{t('cow_feed_transaction')} - {date || t('select_date')}</strong>
        </h2>

        <h5 className="text-left mb-3">{t('cow_feed_transactions')}</h5>
        {cowFeedData.length > 0 ? (
          <div className="table-responsive p-2">
            <table className="table table-bordered table-striped table-sm">
              <thead className="table-dark">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('date')}</th>
                  <th>{t('feed_name')}</th>
                  <th>{t('bags')}</th>
                  <th>{t('price')}</th>
                  <th>{t('total_value')}</th>
                </tr>
              </thead>
              <tbody>
                {cowFeedData.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.farmerName}</td>
                    <td>{new Date(tx.date).toISOString().split("T")[0]}</td>
                    <td>{tx.cowFeedName}</td>
                    <td>{tx.allocated_bags}</td>
                    <td>₹{tx.price}</td>
                    <td>₹{tx.total_cowFeed_price}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {t('final_total_cowfeed_price')}: ₹{totalCowFeedPrice}, {t('final_total_cowfeed_bags')}: {totalCowFeedBags}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted">{t('no_transactions')}</p>
        )}
      </div>
    </div>
  );
};

export default FFarmersCowFeedAsPerDate;
