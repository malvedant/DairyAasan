import React, { useContext, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import farmerImg from "../assetes/farmer.png";
import FarmerModal from "../components/farmerModal";
import { useTranslation } from "react-i18next"; // ✅ Added language logic

const FarmersList = () => {
  const navigate = useNavigate();
  const { farmersData, getFarmersData } = useContext(AppContext);
  const [visiblePin, setVisiblePin] = useState(false);
  const [currenrIndex, setCurrenrIndex] = useState(0);
  const { t } = useTranslation(); // ✅ Initialize translation

  return (
    <div>
      <UserNavbar />

      <FarmerModal
        visiblePin={visiblePin}
        setVisiblePin={setVisiblePin}
        farmerData={farmersData[currenrIndex]}
        onDeleteSuccess={async () => {
          await getFarmersData();
        }}
      />

      <div className="container">
        <button
          className="btn btn-outline-success me-2"
          onClick={() => navigate("/add-farmer")}
        >
          {t("addFarmer")}
        </button>

        <div className="row">
          {farmersData.map((item, index) => (
            <div key={index} className="col-md-3" style={{ padding: "0" }}>
              <div
                className="card border border-green rounded overflow-hidden cursor-pointer shadow-sm"
                onClick={() => {
                  setVisiblePin(true);
                  setCurrenrIndex(index);
                }}
                style={{
                  width: "250px",
                  height: "300px",
                  transition: "transform 0.5s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <img
                  className="bg-blue-50 mx-auto mt-2"
                  src={farmerImg}
                  alt=""
                  style={{
                    width: "100px",
                    height: "120px",
                  }}
                />

                <div className="card-body p-2 text-center">
                  <h6 className="card-title text-dark mb-1">
                    {t("nameLabel")} : {item.name}
                  </h6>
                  <p className="text-muted small">
                    {t("phoneLabel")}: {item.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmersList;
