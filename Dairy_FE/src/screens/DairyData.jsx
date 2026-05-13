import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import UserNavbar from "../components/UserNavbar";
import FarmerListCard from "../components/modals/FarmerListCard";
import TodaysMilkCountDetailsCard from "../components/todaysMilkCoutDetailsCard.jsx";
import TodaysCowFeedDataCard from "../components/todaysCowFeedDataCard.jsx";
import AdvancePaymentCard from "../components/AdvancePaymentCard.jsx";
import MilkPriceHistoryCard from "../components/MilkPriceHistoryCard.jsx";
import MilkCollectionAsPerDateCard from "../components/milkCollectionAsPerDateCard.jsx";
import CowFeedAllocationAsPerDateCard from "../components/CowFeedAllocationAsPerDateCard.jsx";
import PaymentHistoryCard from "../components/PaymentHistoryCard.jsx";
import TenDaysMilkCollectionCard from "../components/TenDaysMilkCollectionCard.jsx";
import TenDaysCowFeedAllocationCard from "../components/TenDaysCowFeedAllocationCard.jsx";
import EmiTransactionCard from "../components/EmiTransactionCard.jsx";
import FeedCard from "../components/CowFeedCard";
import PriceFatTable from "../components/modals/PriceFatTable.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const DairyData = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  const menuItems = [
    { key: "farmers_list" },
    { key: "todays_milk_collection" },
    { key: "todays_cow_feed" },
    { key: "advance_payments" },
    { key: "milk_price_history" },
    { key: "milk_collection_date" },
    { key: "cow_feed_date" },
    { key: "payment_history" },
    { key: "ten_days_milk" },
    { key: "ten_days_feed" },
    { key: "emi_history" },
    { key: "feed_stock" },
     { key: "price_according_fat" }
  ];

  return (
    <div>
      <UserNavbar />
      <div className="d-flex bg-white vh-100">
        {/* Sidebar */}
        <div className="p-3 border-end bg-white">
          <ul className="list-unstyled">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => setCurrentIndex(index)}
                  className={`btn w-100 text-start text-dark ${
                    currentIndex === index
                      ? "btn-success text-white"
                      : "btn-outline-success"
                  }`}
                >
                  {t(item.key)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-3">
          {currentIndex === 0 && <FarmerListCard />}
          {currentIndex === 1 && <TodaysMilkCountDetailsCard />}
          {currentIndex === 2 && <TodaysCowFeedDataCard />}
          {currentIndex === 3 && <AdvancePaymentCard />}
          {currentIndex === 4 && <MilkPriceHistoryCard />}
          {currentIndex === 5 && <MilkCollectionAsPerDateCard />}
          {currentIndex === 6 && <CowFeedAllocationAsPerDateCard />}
          {currentIndex === 7 && <PaymentHistoryCard />}
          {currentIndex === 8 && <TenDaysMilkCollectionCard />}
          {currentIndex === 9 && <TenDaysCowFeedAllocationCard />}
          {currentIndex === 10 && <EmiTransactionCard />}
          {currentIndex === 11 && <FeedCard />}
           {currentIndex === 12 && <PriceFatTable />}


        </div>
      </div>
    </div>
  );
};

export default DairyData;
