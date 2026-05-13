import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FFarmersTodayMilkCollection from "../FarmerData/farmerTodaysMilkCollection";
import FFarmersTodayCowFeed from "../FarmerData/farmerTodaysCowFeed";
import FFarmersMilkPriceHistory from "../FarmerData/farmerMilkPriceHistory";
import FFarmersMilkCollectionAsPerDate from "../FarmerData/farmerMilkCollectionAsperDate";
import FFarmersCowFeedAsPerDate from "../FarmerData/farmerCowFeedAsPerDate";
import FFarmersPaymentHistory from "../FarmerData/farmerPaymentHistory";
import FFarmerTenDaysMilkCollection from "../FarmerData/FarmerTenDaysMilkCollection";
import FFarmerTenDaysCowFeed from "../FarmerData/farmerTenDaysCowFeed";
import FFarmersEmiTransactionHistory from "../FarmerData/farmerEmiTransactionHistory";
import FFarmersAdvancePayment from "../FarmerData/farmerAdvancePayment";
import { AppContext } from "../../Context/AppContext";
import { useTranslation } from "react-i18next"; // Import translation hook

const FFarmerServiceCard = () => {
  const { t } = useTranslation(); // Translation hook
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);

  const menuItems = [
    { name: t("todays_milk_collection"), content: "Today's milk collection details..." },
    { name: t("todays_cowfeed"), content: "Today's milk collection details..." },
    { name: t("milk_price_history"), content: "Milk price history records..." },
    { name: t("milk_collection_date"), content: "Milk price history records..." },
    { name: t("cow_feed_date"), content: "Milk price history records..." },
    { name: t("payment_history"), content: "Payment history records..." },
    { name: t("ten_days_milk"), content: "Payment history records..." },
    { name: t("ten_days_feed"), content: "Payment history records..." },
    { name: t("emi_history"), content: "Payment history records..." },
    { name: t("advance_payments"), content: "Advance payments list..." },
  ];

  return (
    <div className='d-flex bg-white vh-100'>
      <div className='p-3 border-end bg-white'>
        <ul className='list-unstyled'>
          {menuItems.map((item, index) => (
            <li key={index} className='mb-2'>
              <button
                onClick={() => setCurrentMenuIndex(index)}
                className={`btn w-100 text-start text-dark ${
                  currentMenuIndex === index ? "btn-success text-white" : "btn-outline-success"
                }`}
                aria-current={currentMenuIndex === index ? "page" : undefined}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='flex-grow-1 p-3'>
        {currentMenuIndex === 0 && <FFarmersTodayMilkCollection />}
        {currentMenuIndex === 1 && <FFarmersTodayCowFeed />}
        {currentMenuIndex === 2 && <FFarmersMilkPriceHistory />}
        {currentMenuIndex === 3 && <FFarmersMilkCollectionAsPerDate />}
        {currentMenuIndex === 4 && <FFarmersCowFeedAsPerDate />}
        {currentMenuIndex === 5 && <FFarmersPaymentHistory />}
        {currentMenuIndex === 6 && <FFarmerTenDaysMilkCollection />}
        {currentMenuIndex === 7 && <FFarmerTenDaysCowFeed />}
        {currentMenuIndex === 8 && <FFarmersEmiTransactionHistory />}
        {currentMenuIndex === 9 && <FFarmersAdvancePayment />}
      </div>
    </div>
  );
};

export default FFarmerServiceCard;
