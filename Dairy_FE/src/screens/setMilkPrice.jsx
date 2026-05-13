import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";
import UserNavbar from "../components/UserNavbar";
import setPriceIcon from "../assetes/Dairy/setPrice.webp";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

function SetMilkPrice() {
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  // ✅ DATE FIX (important)
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [fatRate, setFatRate] = useState("");
  const [snfRate, setSnfRate] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ FETCH EXISTING DATA
  useEffect(() => {
    const fetchRate = async () => {
      if (!date || !userData?.id) return;

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/D_owner/get-todays-milkprice`,
          {
            date,
            D_owner_id: userData.id,
          }
        );

        if (data.success && data.data) {
          setIsEditMode(true);

          setFatRate(data.data.fatRate || "");
          setSnfRate(data.data.snfRate || "");
        } else {
          setIsEditMode(false);
          setFatRate("");
          setSnfRate("");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch rate");
      }
    };

    fetchRate();
  }, [date, backendUrl, userData]);

  // ✅ COMMON VALIDATION
  const validate = () => {
    if (!date || !fatRate || !snfRate || !userData?.id) {
      toast.error("Missing details");
      return false;
    }
    return true;
  };

  // ✅ CREATE RATE
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/set-milk-price`,
        {
          date,
          fatRate: Number(fatRate),
          snfRate: Number(snfRate),
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEditMode(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error setting rate");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE RATE
  const handleEdit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/edit-milk-price`,
        {
          date,
          fatRate: Number(fatRate),
          snfRate: Number(snfRate),
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserNavbar />

      {/* BACK BUTTON */}
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

        {/* FORM */}
        <div className="container col-md-7">

          {/* DATE */}
          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label>{t("date")}</label>
          </div>

          {/* FAT RATE */}
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={fatRate}
              onChange={(e) => setFatRate(e.target.value)}
            />
            <label>Fat Rate (₹)</label>
          </div>

          {/* SNF RATE */}
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={snfRate}
              onChange={(e) => setSnfRate(e.target.value)}
            />
            <label>SNF Rate (₹)</label>
          </div>

          {/* BUTTON */}
          <div className="text-center my-2">
            {isEditMode ? (
              <button
                className="btn btn-primary w-75"
                onClick={handleEdit}
                disabled={loading}
              >
                {loading ? (
                  <PushSpinner size={30} color="white" />
                ) : (
                  "Update Rate"
                )}
              </button>
            ) : (
              <button
                className="btn btn-success w-75"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <PushSpinner size={30} color="white" />
                ) : (
                  "Set Rate"
                )}
              </button>
            )}
          </div>
        </div>

        {/* IMAGE */}
        <div className="container">
          <img
            src={setPriceIcon}
            className="img-fluid"
            alt="Set Price"
          />
        </div>
      </div>
    </div>
  );
}

export default SetMilkPrice;