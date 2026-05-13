import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";
import UserNavbar from "../components/UserNavbar";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import AdvancePaymentCard from "../components/AdvancePaymentCard.jsx";
import { useTranslation } from "react-i18next"; // ✅ added for multilanguage support

function AdvancePayment() {
  const [loading, setLoading] = useState(false);
  const [emiExpireDate, setEmiExpireDate] = useState("");
  const [date, setDate] = useState("");
  const [advancePayment, setAdvancePayment] = useState(null);
  const [year, setYear] = useState(null);
  const [monthlyEmi, setMonthlyEmi] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [farmerName, setFarmerName] = useState("");

  const { backendUrl, userData, farmersData, getAllAdvancePayment } =
    useContext(AppContext);
  const navigate = useNavigate();

  const { t } = useTranslation(); // ✅ translation hook

  // Set the current date when the component mounts
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Calculate monthly EMI (rounded to 2 decimal places)
  useEffect(() => {
    if (advancePayment && year) {
      const emi =
        (parseFloat(advancePayment) || 0) /
        ((parseFloat(year) * 36.5) || 1);
      setMonthlyEmi(emi.toFixed(2)); // Rounds to 2 decimal places
    } else {
      setMonthlyEmi(null);
    }
  }, [year, advancePayment]);

  // Calculate EMI Expiry Date
  useEffect(() => {
    if (year) {
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + parseInt(year));
      setEmiExpireDate(expireDate.toISOString().split("T")[0]);
    }
  }, [year]);

  const handleSubmit = async () => {
    if (!date || !advancePayment || !monthlyEmi || !selectedFarmer || !year) {
      toast.error(t("fillAllFields")); // ✅ translated
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/make-advance-payment`,
        {
          date,
          year,
          advancePayment,
          monthlyEmi,
          emiExpireDate,
          D_owner_id: userData.id,
          farmer_id: selectedFarmer,
        }
      );

      if (data.success) {
        await getAllAdvancePayment();
        toast.success(data.message);
        setDate(new Date().toISOString().split("T")[0]);
        setAdvancePayment(null);
        setYear(null);
        setFarmerName("");
        setSelectedFarmer("");
        setMonthlyEmi(null);
        setEmiExpireDate("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("errorMsg") // ✅ translated fallback
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="back-arrow position-absolute top-5 start-0 p-3">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2x"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
      </div>

      <ToastContainer />

      <div className="shadow rounded m-4 p-4 d-flex flex-row">
        <div className="container">
          <div className="container col-md-7">
            {/* Farmer Dropdown */}
            <div className="form-floating mb-3">
              <select
                className="form-select"
                value={selectedFarmer}
                onChange={(e) => {
                  const selected = farmersData.find(
                    (farmer) => farmer._id === e.target.value
                  );
                  setSelectedFarmer(e.target.value);
                  setFarmerName(selected ? selected.name : "");
                }}
              >
                <option value="" disabled>
                  {t("selectFarmer")}
                </option>
                {farmersData?.map((farmer) => (
                  <option key={farmer._id} value={farmer._id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
              <label htmlFor="farmerDropdown">{t("selectFarmerLabel")}</label>
            </div>

            {/* Advance Payment Field */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("advanceAmountPlaceholder")}
                value={advancePayment || ""}
                onChange={(e) => setAdvancePayment(e.target.value)}
              />
              <label htmlFor="advancePayment">{t("advanceAmountLabel")}</label>
            </div>

            {/* Date Field (Auto-set to current date) */}
            <div className="form-floating mb-3">
              <input type="date" className="form-control" value={date} readOnly />
              <label htmlFor="date">{t("dateLabel")}</label>
            </div>

            {/* Year Field */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("yearPlaceholder")}
                value={year || ""}
                onChange={(e) => setYear(e.target.value)}
              />
              <label htmlFor="year">{t("yearLabel")}</label>
            </div>

            {/* Monthly EMI Field (Read-Only) */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("monthlyEmiPlaceholder")}
                readOnly
                value={monthlyEmi || ""}
              />
              <label htmlFor="monthlyEmi">{t("monthlyEmiLabel")}</label>
            </div>

            {/* EMI Expiry Date (Auto-calculated) */}
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
                readOnly
                value={emiExpireDate || ""}
              />
              <label htmlFor="emiExpireDate">{t("emiExpiryDateLabel")}</label>
            </div>

            {/* Submit Button */}
            <div className="text-center my-2">
              <button
                id="submitButton"
                className="btn btn-success w-75 text-center"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="container d-flex justify-content-center align-items-center">
                    <PushSpinner size={30} color="white" />
                  </div>
                ) : (
                  t("addDataBtn")
                )}
              </button>
            </div>
          </div>
        </div>

        <AdvancePaymentCard />
      </div>
    </div>
  );
}

export default AdvancePayment;
