import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PushSpinner } from "react-spinners-kit";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import signupImg from "../assetes/signup.png";
import { AppContext } from "../Context/AppContext";
import UserNavbar from "../components/UserNavbar";
import { useTranslation } from "react-i18next";

function AddFarmers() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("farmer");
  const navigate = useNavigate();

  const { backendUrl, userData, getFarmersData } = useContext(AppContext);

  const { t } = useTranslation();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/D_owner/add-farmer`, {
        name,
        email,
        password,
        phone,
        role,
        D_owner_id: userData?.id,
      });

      setLoading(false);
      if (response.data.success) {
        getFarmersData();
        toast.success(response.data.message);
        navigate("/farmers-list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup Error:", error);
      toast.error(t("errorMsg"));
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
        <strong>{t("title")}</strong>
      </h2>

      <div className="container p-3">
        <form
          className="d-flex p-3 container rounded position-relative"
          style={{ zIndex: 2 }}
          onSubmit={onSubmitHandler}
        >
          <div data-aos="fade-right" className="container col-md-7">
            {/* Name */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="fName"
                placeholder={t("namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="fName">{t("nameLabel")}</label>
            </div>

            {/* Phone */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="mobileNumber"
                placeholder={t("phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label htmlFor="mobileNumber">{t("phoneLabel")}</label>
            </div>

            {/* Email */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">{t("emailLabel")}</label>
            </div>

            {/* Password */}
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">{t("passwordLabel")}</label>
            </div>

            {/* Role */}
            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="farmer">{t("roleOption")}</option>
              </select>
              <label htmlFor="role">{t("roleLabel")}</label>
            </div>

            <p className="text-end">
              <Link to="/" style={{ color: "red", textDecoration: "none" }}>
                {t("alreadyAccount")}
              </Link>
            </p>

            {/* Submit */}
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
                  t("submitBtn")
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

export default AddFarmers;
