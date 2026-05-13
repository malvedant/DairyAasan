import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "../featurs/userSlice";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import LanguageSwitcher from "./forms/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function UserNavbar() {
  const { t } = useTranslation();
  const { backendUrl, setUserData,setFarmersData } = useContext(AppContext);

 
 const navigate = useNavigate(); 

const logout = async () => {
    try {
        const { data } = await axios.post(backendUrl + "/api/user/logout");

        if (data.success) {
            toast.success(data.message);
            
          
            setUserData(null); 
            setFarmersData(null);
            
            localStorage.setItem("authToken",null);
            localStorage.setItem("userData", null);
            localStorage.setItem("farmersData", null);
            localStorage.setItem("cowFeedData",null);
            localStorage.setItem("todaysMilkData",null);
            localStorage.setItem("advancePaymentData",null);
            localStorage.setItem("emiTransaction",null);
            localStorage.setItem("milkPriceHistory",null);
            localStorage.setItem("paymentHistory",null);



            navigate("/"); 
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
    }
};

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/user">
          <strong> {t("dairy_Logo")}</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/user">
               {t("home")}
              </Link>
            </li>
            <li className="nav-item">
            
            </li>
            
          </ul>
          <div className="d-flex">
            <LanguageSwitcher/>
            <button
              className="btn btn-outline-success me-2"
              onClick={() => {
                navigate("/update-profile");
              }}
            >
            {t("update_profile")}
            </button>
            <button className="btn btn-outline-danger me-2" onClick={logout}>
            {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
