import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useTranslation } from "react-i18next";

const AdvancePaymentCard = () => {
  const { advancePaymentData } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className="container d-flex flex-column gap-2 rounded shadow p-3 border-0 vh-100">
      <div className="text-center">
        <h4><strong>{t("all_advance_payments")}</strong></h4>
      </div>
      <div className="d-flex flex-column gap-3">
        {advancePaymentData.length > 0 ? (
          advancePaymentData.map((data, index) => (
            <div
              key={index}
              className="d-flex w-full rounded shadow p-2 gap-1 border-0"
              style={{ fontSize: "0.9rem" }}
            >
              <p>
                <strong>{data.farmerName || "N/A"}</strong>
              </p>
              <p>
                {t("advance")}: ₹{data.advancePayment || "0"}
              </p>
              <p>
                {t("date")}: {data.date || "N/A"} → {data.emiExpireDate || "N/A"}
              </p>
              <p>
                {t("emi")}: ₹{data.monthlyEmi || "0"}
              </p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "0.9rem" }}>{t("no_records_found")}</p>
        )}
      </div>
    </div>
  );
};

export default AdvancePaymentCard;
