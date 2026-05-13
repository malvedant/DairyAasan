import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import { useTranslation } from "react-i18next";

function Contact() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="back-arrow position-absolute top-5 start-0 p-3">
        <FontAwesomeIcon icon={faArrowLeft} size="2x" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
      </div>
      <div className="container">
        <h1>{t("about_title")}</h1>
        <p className="lead">{t("about_subtitle")}</p>
        <div className='text-end'>
          <img src="https://cdni.iconscout.com/illustration/free/thumb/free-about-us-2061897-1740019.png" alt="" />
        </div>

        <section className="mt-4">
          <h2>{t("mission_title")}</h2>
          <p>{t("mission_text")}</p>
          <div className="text-start">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhby3zuqh4Ez-L_aU7W8Fs7j6G-TOJNUj20Q&s" alt="" />
          </div>
        </section>

        <section className="mt-4">
          <h2>{t("vision_title")}</h2>
          <p>{t("vision_text")}</p>
          <div className="text-end">
            <img src="https://roland.ac.in/site/wp-content/uploads/2019/04/Vision.png" alt="" />
          </div>
        </section>

        <section className="mt-4">
          <h2>{t("team_title")}</h2>
          <p>{t("team_text")}</p>
          <div className="text-start">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/join-our-team-4880594-4062783.png?f=webp" alt="" />
          </div>
        </section>

        <section className="mt-4">
          <h2>{t("contact_title")}</h2>
          <p>
            {t("contact_text")}{" "}
            <a href="mailto:support@dairyhub.com">{t("contact_email")}</a>.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
