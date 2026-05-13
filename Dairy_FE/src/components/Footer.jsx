import React from 'react';
import twitter from '../assetes/twitter.png';
import facebook from '../assetes/facebook.png';
import instagram from '../assetes/instagram.png';
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="container-fluid footer-div d-flex flex-row flex-wrap "
      style={{ backgroundColor: "#DCDCDC" }}
    >
      <section className="col-md-4 p-2">
        <div className="conatainer">
          <img className="img-fluid social-img hover" src={twitter} alt="" />
          <img className="img-fluid social-img hover" src={facebook} alt="" />
          <img className="img-fluid social-img hover" src={instagram} alt="" />
        </div>
        <div className="conatiner m-0 p-0">
          <p className="hover m-0 p-0">{t("footer_copy")}</p>
          <br />
          <p className="hover m-0 p-0">
            <strong>{t("dairy_Logo")}  </strong>, {t("footer_rights")}
          </p>
        </div>
      </section>

      <section className="col-md-4 p-2">
        <h6>{t("footer_contact_title")}</h6>
        <p className="hover m-0 p-0">{t("footer_address")}</p>
        <p className="hover m-0 p-0">{t("footer_phone")}</p>
        <p className="hover m-0 p-0">{t("footer_email")}</p>
      </section>

      <section className="col-md-4 p-2">
        <h6>{t("footer_account_title")}</h6>
        <p className="hover m-0 p-0">{t("footer_create_account")}</p>
        <p className="hover m-0 p-0">{t("footer_sign_in")}</p>
        <p className="hover m-0 p-0">{t("footer_android_app")}</p>
        <p className="hover m-0 p-0">{t("footer_ios_app")}</p>
      </section>
    </footer>
  );
}

export default Footer;
