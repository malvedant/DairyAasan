import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import setPriceIcon from '../assetes/Dairy/setPrice.webp';
import feedAvailabilityIcon from '../assetes/Dairy/cowFeed.jpg';
import milkCountIcon from '../assetes/Dairy/farmerDairy.webp';
import { useNavigate } from 'react-router-dom';

function AdminServicesCard() {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const cardData = [
        {
            img: setPriceIcon,
            title: t("set_milk_price"),
            buttonText: t("set_price_button"),
            pageRoute: "/set-milk-price",
            text: t("set_milk_price_text"),
        },
        {
            img: feedAvailabilityIcon,
            title: t("cow_feed_availability"),
            buttonText: t("check_availability_button"),
            pageRoute: "/cow-feed-availability",
            text: t("cow_feed_availability_text"),
        },
       
        {
            img: setPriceIcon,
            title: t("bill_payment"),
            buttonText: t("bill_button"),
            pageRoute: "/bill-payment",
            text: t("bill_payment_text"),
        },
          {
            img: milkCountIcon,
            title: t("add_farmer_milk_count"),
            buttonText: t("add_count_button"),
            pageRoute: "/add-milk-count",
            text: t("add_farmer_milk_count_text"),
        },
        {
            img: milkCountIcon,
            title: t("advance_payment"),
            buttonText: t("advance_payment_button"),
            pageRoute: "/make-advance-payment",
            text: t("advance_payment_text"),
        },
       
        {
            img: milkCountIcon,
            title: t("farmers_list"),
            buttonText: t("list_button"),
            pageRoute: "/farmers-list",
            text: t("farmers_list_text"),
        },
        {
            img: milkCountIcon,
            title: t("dairy_data"),
            buttonText: t("list_button"),
            pageRoute: "/dairy-data-screen",
            text: t("dairy_data_text"),
        },
        
      
    ];

    const handlePrev = () => setIndex(index === 0 ? cardData.length - 1 : index - 1);
    const handleNext = () => setIndex(index === cardData.length - 1 ? 0 : index + 1);

    const visibleCards = [
        cardData[(index - 1 + cardData.length) % cardData.length],
        cardData[index],
        cardData[(index + 1) % cardData.length],
    ];

    return (
        <div className="carousel-container mt-3 p-4">
            <button className="carousel-control prev" onClick={handlePrev}>‹</button>
            <div className="carousel-inner p-1 d-flex justify-content-center">
                {visibleCards.map((card, i) => (
                    <div key={i} className={`card-container ${i === 1 ? 'active' : ''}`}>
                        <div className="card rounded shadow p-3 border-0" style={{ width: '20rem' }}>
                            <img
                                src={card.img}
                                className="card-img-top"
                                alt={card.title}
                                style={{ height: '10rem', objectFit: 'contain' }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title">{card.title}</h5>
                                <p className="card-text">{card.text}</p>
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => navigate(card.pageRoute)}
                                >
                                    {card.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control next" onClick={handleNext}>›</button>
        </div>
    );
}

export default AdminServicesCard;
