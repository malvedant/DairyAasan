import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import UserNavbar from '../components/UserNavbar';
import AdminServicesCard from '../components/AdminServiceCard';
import { AppContext } from '../Context/AppContext';
import cowAi5 from '../assetes/Dairy/IMG-20251109-WA0005.png';
import { useTranslation } from "react-i18next";
import DairyAi from './DairyAi'; // 👈 Import the chatbot
import '../styles/Popup.css'; // 👈 Add this new CSS file

function UserDashBord() {
  const { userData } = useContext(AppContext);
  const { t } = useTranslation();
  const [showAi, setShowAi] = useState(false); // 👈 For popup state

  if (!userData) return null;

  return (
    <div className="container-fluid p-0 position-relative">
      <UserNavbar />

      {/* 🐄 Cow Image (Click to open AI popup) */}
      <img
        src={cowAi5}
        onClick={() => setShowAi(true)}
        alt="Cow"
        className="position-absolute shrink-image"
        style={{ top: '40px', left: '20px', maxWidth: '200px', cursor: 'pointer' }}
      />

      {/* Greeting */}
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="text-center">
          <h3>{t("hello")} <strong>{userData.name}</strong>,</h3>
          <h6>{t("welcome_back")}</h6>
        </div>
      </div>

      {/* Admin Services */}
      <div className="container mt-4">
        <AdminServicesCard />
      </div>

      {/* Footer */}
      <Footer />

      {/* 💬 Dairy AI Popup */}
      {showAi && (
        <div className="ai-overlay" onClick={() => setShowAi(false)}>
          <div
            className="ai-popup"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button className="close-btn text-black" onClick={() => setShowAi(false)}>✖</button>
            <DairyAi />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashBord;
