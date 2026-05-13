import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const FarmerListCard = () => {
  const { farmersData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="row">
        {farmersData.map((_, index) => (
          <div key={index} className="col-14 col-sm-8 col-md-6 col-lg-5 mb-4">
            <div
              className="card border border-success rounded shadow-sm h-100"
              style={{
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => navigate("/farmers-data", { state: { currentIndex: index } })}
            >
              <div className="card-body p-3 text-start">
                <h6 className="card-title text-dark mb-1">Name: {farmersData[index].name}</h6>
                <p className="text-muted small mb-1">Mobile No: {farmersData[index].phone}</p>
                <p className="text-muted small">Email ID: {farmersData[index].email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmerListCard;
