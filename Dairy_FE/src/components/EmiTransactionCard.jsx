import React, { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import { useTranslation } from "react-i18next";

const EmiTransactionCard = () => {
  const { t } = useTranslation();
  const { getEmiTransactionHistory, emiTransctions } = useContext(AppContext);

  useEffect(() => {
    getEmiTransactionHistory();
  }, []);

  return (
    <div>
      <h5 className="text-center mb-3">{t("emi_transaction_history")}</h5>
      {emiTransctions?.length > 0 ? (
        <div className="table-responsive p-2">
          <table className="table table-bordered table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("name")}</th>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("emi_paid_date")}</th>
                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("emi_price")}</th>
                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("emi_expire_date")}</th>
              </tr>
            </thead>
            <tbody>
              {emiTransctions.map((tx, index) => {
                const formattedDate = new Date(tx.date).toISOString().split("T")[0];
                const formattedemiExpireDate = new Date(tx.emiExpireDate).toISOString().split("T")[0];
                return (
                  <tr key={index}>
                    <td>{tx.farmerName}</td>
                    <td>{formattedDate}</td>
                    <td>₹{tx.monthlyEmi}</td>
                    <td>{formattedemiExpireDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">{t("no_payment_history")}</p>
      )}
    </div>
  );
};

export default EmiTransactionCard;
