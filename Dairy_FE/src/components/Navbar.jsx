import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './forms/LanguageSwitcher';
import { useTranslation } from "react-i18next";

function Navbar() {
   const { t } = useTranslation();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand text-success" to="/"> <strong>    {t("dairy_Logo")} </strong></Link>
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
              <Link className="nav-link active" aria-current="page" to="#">{t("home")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact"> {t("contact_us")}</Link>
            </li>
            
          </ul>
          <div className="d-flex">
            <LanguageSwitcher/>
            <Link to="/login" className="btn btn-outline-success me-2"> {t("login")}</Link>
            <Link to="/signup" className="btn btn-outline-primary"> {t("signup")}</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
