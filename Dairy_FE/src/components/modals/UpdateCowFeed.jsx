import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { PushSpinner } from "react-spinners-kit";

import { AppContext } from "../../Context/AppContext";
import UserNavbar from "../UserNavbar";
import Footer from "../Footer";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next"; // ✅ Language logic

function UpdateCowFeed() {
  const { t } = useTranslation(); // ✅ useTranslation hook
  const currentDate = new Date().toISOString().split("T")[0];
  const location = useLocation();
  const { index, visiblePin } = location.state || {};

  const cowFeedData = JSON.parse(localStorage.getItem("cowFeedData")) || [];
  const cowFeedItem = cowFeedData[index] || {};

  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState("");
  const [date, setDate] = useState(currentDate);

  const navigate = useNavigate();
  const { backendUrl, userData, getCowFeedDetails } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/add-cowFeed-stock`,
        {
          cowFeed_id: cowFeedItem._id,
          cowFeedName: cowFeedItem.cowFeedName,
          stock,
          price: cowFeedItem.price,
          date,
          D_owner_id: userData?.id,
        }
      );

      setLoading(false);
      if (data.success) {
        toast.success(data.message);
        await getCowFeedDetails();
        navigate("/cow-feed-availability");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error(t("error_try_again")); // ✅ Translated error message
    }
  };

  return (
    <div className="container-fluid">
      <UserNavbar />
      <div className="back-arrow position-absolute top-5 start-0 p-3">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2x"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
      </div>

      <h2 className="text-start my-2 mt-5">
        <strong>{t("update_cowfeed_stock")}</strong> {/* ✅ Translated heading */}
      </h2>

      <div className="container p-3">
        <form
          className="d-flex p-3 container rounded position-relative"
          style={{ zIndex: 2 }}
          onSubmit={onSubmitHandler}
        >
          <div data-aos="fade-right" className="container col-md-7">
            {/* CowFeed Name (Read-Only) */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder={t("cowfeed_name")}
                value={cowFeedItem.cowFeedName || ""}
                readOnly
              />
              <label>{t("cowfeed_name")}</label>
            </div>

            {/* Stock Input */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("cowfeed_stock")}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
              <label>{t("cowfeed_stock")}</label>
            </div>

            {/* Price Input */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("cowfeed_price")}
                value={cowFeedItem.price || ""}
                readOnly
              />
              <label>{t("cowfeed_price")}</label>
            </div>

            {/* Submit Button */}
            <div className="text-center my-2">
              <button
                className="btn btn-success w-75 text-center"
                type="submit"
                disabled={loading}
              >
                {loading ? <PushSpinner size={30} color="white" /> : t("update_stock")}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default UpdateCowFeed;
