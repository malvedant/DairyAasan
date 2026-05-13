import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CButton } from "@coreui/react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // ✅ Added language logic

import FarmerListCard from '../components/modals/FarmerListCard';
import TodaysMilkCountDetailsCard from '../components/todaysMilkCoutDetailsCard.jsx';
import TodaysCowFeedDataCard from '../components/todaysCowFeedDataCard.jsx';
import AdvancePaymentCard from "../components/AdvancePaymentCard.jsx";
import MilkPriceHistoryCard from '../components/MilkPriceHistoryCard.jsx';
import MilkCollectionAsPerDateCard from '../components/milkCollectionAsPerDateCard.jsx';
import CowFeedAllocationAsPerDateCard from '../components/CowFeedAllocationAsPerDateCard.jsx';
import PaymentHistoryCard from '../components/PaymentHistoryCard.jsx';
import TenDaysMilkCollectionCard from '../components/TenDaysMilkCollectionCard.jsx';
import TenDaysCowFeedAllocationCard from '../components/TenDaysCowFeedAllocationCard.jsx';
import EmiTransactionCard from '../components/EmiTransactionCard.jsx';
import FeedCard from "../components/CowFeedCard";
import FarmersTodayMilkCollection from "../components/DairyOwnerFarmerSite/farmersTodayMilkCollection.jsx";
import FarmersTodayCowFeed from "../components/DairyOwnerFarmerSite/farmersTodaysCowFeed.jsx";
import FarmersMilkPriceHistory from "../components/DairyOwnerFarmerSite/farmersMilkPriceHistory.jsx";
import FarmersMilkCollectionAsPerDate from "../components/DairyOwnerFarmerSite/farmersMilkCollectonAsPerDate.jsx";
import FarmersCowFeedAsPerDate from "../components/DairyOwnerFarmerSite/farmersCowFeedAsPerDate.jsx";
import FarmersEmiTransactionHistory from "../components/DairyOwnerFarmerSite/farmerEmiTransactionHistory.jsx";
import FarmerTenDaysMilkCollection from "../components/DairyOwnerFarmerSite/farmerTenDaysMilkTransaction.jsx";
import FarmerTenDaysCowFeed from "../components/DairyOwnerFarmerSite/farmerTenDaysCowFeed.jsx";
import FarmersAdvancePayment from "../components/DairyOwnerFarmerSite/farmerAdvancePayment.jsx";
import FarmersPaymentHistory from "../components/DairyOwnerFarmerSite/farmerPaymentHistory.jsx";

const FarmersData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { farmersData } = useContext(AppContext);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const { t } = useTranslation(); // ✅ Translation hook added

  const currentIndex = location.state?.currentIndex;

  // Validate index
  if (currentIndex === undefined || currentIndex < 0 || currentIndex >= farmersData.length) {
    toast.error(t("invalid_farmer_index")); // ✅ Translated toast
    navigate("/farmers");
    return null;
  }

  const farmer = farmersData[currentIndex];

  const menuItems = [
    { key: "todays_all_milk_collection" },
    { key: "todays_all_allocated_cow_feed" },
    { key: "advance_payments" },
    { key: "milk_price_history" },
    { key: "milk_collection_date" },
    { key: "cow_feed_date" },
    { key: "payment_history" },
    { key: "ten_days_milk" },
    { key: "ten_days_feed" },
    { key: "emi_history" }
  ];

  return (
    <div>
      <div className="container d-flex mt-4 gap-4">
        <h4>{t("farmer_details")}</h4>
        <p><strong>{t("nameLabel")}:</strong> {farmer.name}</p>
        <p><strong>{t("phoneLabel")}:</strong> {farmer.phone}</p>
        <p><strong>{t("emailLabel")}:</strong> {farmer.email}</p>
        <p><strong>{t("roleLabel")}:</strong> {farmer.role}</p>
      </div>

      <div className="d-flex bg-white vh-100">
        {/* Sidebar Menu */}
        <div className="p-3 border-end bg-white">
          <ul className="list-unstyled">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => setCurrentMenuIndex(index)}
                  className={`btn w-100 text-start text-dark ${
                    currentMenuIndex === index
                      ? "btn-success text-white"
                      : "btn-outline-success"
                  }`}
                  aria-current={currentMenuIndex === index ? "page" : undefined}
                >
                  {t(item.key)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Content */}
        <div className="flex-grow-1 p-3">
          {currentMenuIndex === 0 && <FarmersTodayMilkCollection currentIndex={currentIndex} />}
          {currentMenuIndex === 1 && <FarmersTodayCowFeed currentIndex={currentIndex} />}
          {currentMenuIndex === 2 && <FarmersAdvancePayment currentIndex={currentIndex} />}
          {currentMenuIndex === 3 && <FarmersMilkPriceHistory currentIndex={currentIndex} />}
          {currentMenuIndex === 4 && <FarmersMilkCollectionAsPerDate currentIndex={currentIndex} />}
          {currentMenuIndex === 5 && <FarmersCowFeedAsPerDate currentIndex={currentIndex} />}
          {currentMenuIndex === 6 && <FarmersPaymentHistory currentIndex={currentIndex} />}
          {currentMenuIndex === 7 && <FarmerTenDaysMilkCollection currentIndex={currentIndex} />}
          {currentMenuIndex === 8 && <FarmerTenDaysCowFeed currentIndex={currentIndex} />}
          {currentMenuIndex === 9 && <FarmersEmiTransactionHistory currentIndex={currentIndex} />}
        </div>
      </div>
    </div>
  );
};

export default FarmersData;
