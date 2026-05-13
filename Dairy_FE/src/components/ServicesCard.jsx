import React, { useState } from 'react';

import balance from '../assetes/Dairy/cardOne.jpg'
import update from '../assetes/update.png'
import CreditMoney from './modals/creditMoney';
import { useNavigate } from 'react-router-dom';


const cardData = [
    {
        img: balance,
        title: "Check the Milk Status!",
        buttonText:"Check Milk Status",
        stateChangeVariable:"show-milk",
        text: "Easily track your milk collection details. Get quick access to your latest shifts, rates, and total earnings.",
    },
    {
        img: update,
        title: "Account Update!",
        buttonText:"update",
        stateChangeVariable:"update",
        text: "Stay updated with the latest account changes. Get notifications and make adjustments on the go.",
    }
];

function ServicesCard() {
    const [index, setIndex] = useState(0);
    const [visibleTrasaction, setVisibleTrasaction] = useState(false)
    const handlePrev = () => {
        const newIndex = index === 0 ? cardData.length - 1 : index - 1;
        setIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = index === cardData.length - 1 ? 0 : index + 1;
        setIndex(newIndex);
    };

    const visibleCards = [
        cardData[(index - 1 + cardData.length) % cardData.length],
        cardData[index],
        cardData[(index + 1) % cardData.length],
    ];
    const navigate=useNavigate();

    return (
        <div className="carousel-container  mt-3 p-4" >
            <CreditMoney visiblePin={visibleTrasaction} setVisiblePin={setVisibleTrasaction} />
            <button className="carousel-control prev" onClick={handlePrev}>‹</button>
            <div  className="carousel-inner d-flex justify-content-center align-items-center p-5  p-5">
                {visibleCards.map((card, i) => (
                    <div data-aos="fade-up" key={i} className={`card-container ${i === 1 ? 'active' : ''}`}>
                        <div className="card rounded shadow p-3 border border-none" style={{ width: '23rem' }}>
                            <img src={card.img} className="card-img-top" alt={card.title} />
                            <h4>{card.title}</h4>
                            <p>{card.text}</p>
                            <div className="container">
                                <button className='btn btn-success w-75 '
                                onClick={()=>{
                                    if(card.stateChangeVariable=='show-milk'){
                                        navigate('/show-milk');
                                    }
                                    else if(card.stateChangeVariable=='update'){
                                        navigate('/update-profile');
                                    }
                                }}
                                >{card.buttonText}</button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            <button className="carousel-control next" onClick={handleNext}>›</button>
        </div>
    );
}

export default ServicesCard;