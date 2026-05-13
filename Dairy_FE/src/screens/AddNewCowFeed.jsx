import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PushSpinner } from "react-spinners-kit";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import signupImg from "../assetes/signup.png"; // ✅ Fixed path
import { AppContext } from "../Context/AppContext";
import UserNavbar from "../components/UserNavbar";
import { useTranslation } from "react-i18next"; // ✅ added for multilanguage support

function AddNewCowFeed() {
  // ✅ Translation hook
  const { t } = useTranslation();

  // ✅ State Hooks
  const currentDate = new Date(Date.now()).toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [cowFeedName, setCowFeedName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(currentDate);

  const navigate = useNavigate();

  const { backendUrl, userData, getFarmersData, getCowFeedDetails } =
    useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/add-cowFeed-stock`,
        {
          cowFeedName,
          stock,
          price,
          date,
          D_owner_id: userData?.id,
        }
      );

      console.log("API Response:", data); 

      setLoading(false);

      if (data.success) {
        toast.success(data.message);
        await getCowFeedDetails(); // ✅ Ensure this executes
        navigate("/cow-feed-availability");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error(t("errorMsg")); // ✅ translated error
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

      <ToastContainer />
      <h2 className="text-start my-2 mt-5">
        <strong>{t("titleCowFeed")}</strong>
      </h2>

      <div className="container p-3">
        <form
          className="d-flex p-3 container rounded position-relative"
          style={{ zIndex: 2 }}
          onSubmit={onSubmitHandler}
        >
          <div data-aos="fade-right" className="container col-md-7">
            {/* CowFeed Name */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="fName"
                placeholder={t("cowFeedNamePlaceholder")}
                value={cowFeedName}
                onChange={(e) => setCowFeedName(e.target.value)}
                required
              />
              <label htmlFor="fName">{t("cowFeedNameLabel")}</label>
            </div>

            {/* Stock */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("cowFeedStockPlaceholder")}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
              <label htmlFor="mobileNumber">{t("cowFeedStockLabel")}</label>
            </div>

            {/* Price */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder={t("cowFeedPricePlaceholder")}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <label htmlFor="CowFeed Price">{t("cowFeedPriceLabel")}</label>
            </div>

            {/* Submit Button */}
            <div className="text-center my-2">
              <button
                id="signupButton"
                className="btn btn-success w-75 text-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="container d-flex justify-content-center align-items-center">
                    <PushSpinner size={30} color="white" />
                  </div>
                ) : (
                  t("submitBtnCowFeed")
                )}
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            data-aos="fade-left"
            className="container mx-auto my-auto loginImageContainer"
          >
            <img
              id="signUpImage"
              src={signupImg}
              className="img-fluid"
              alt="Sign Up Background"
            />
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default AddNewCowFeed;
