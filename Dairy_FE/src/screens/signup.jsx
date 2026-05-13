import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import signupImg from "../assetes/signup.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/api";
import { PushSpinner } from "react-spinners-kit";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { useTranslation } from "react-i18next"; // ✅ Import translation hook

function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const { t } = useTranslation(); // ✅ initialize translation

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const D_owner_id = "ownid";
      const { data } = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password,
        phone,
        role,
        D_owner_id,
      });

      setLoading(false);

      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(t("error_try_again")); // ✅ translated error message
    }
  };

  return (
    <div className="container-fluid">
      <Navbar />
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
        <strong>{t("signup_heading")}</strong>
      </h2>
      <div className="container p-3">
        <form
          className="d-flex p-3 container rounded position-relative"
          style={{ zIndex: 2 }}
          onSubmit={onSubmitHandler}
        >
          <div data-aos="fade-right" className="container col-md-7">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="fName"
                placeholder={t("name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="fName">{t("name")}</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="mobileNumber"
                placeholder={t("mobile_number")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label htmlFor="mobileNumber">{t("mobile_number")}</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">{t("email")}</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">{t("password")}</label>
            </div>

            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  {t("select_role")}
                </option>
                <option value="dairy-owner">{t("dairy_owner")}</option>
              </select>
              <label htmlFor="role">{t("select_role")}</label>
            </div>

            <p className="text-end">
              <Link to="/" style={{ color: "red", textDecoration: "none" }}>
                {t("already_account")}
              </Link>
            </p>

            <div className="text-center my-2">
              <button
                id="signupButton"
                className="btn btn-success w-75 text-center"
                type="submit"
              >
                {loading ? (
                  <div className="container d-flex justify-content-center align-items-center">
                    <PushSpinner size={30} color="white" />
                  </div>
                ) : (
                  t("sign_up")
                )}
              </button>
            </div>
          </div>

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

export default Signup;
