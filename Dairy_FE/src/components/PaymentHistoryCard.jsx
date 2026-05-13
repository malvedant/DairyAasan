import React, { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import { useTranslation } from "react-i18next";

const PaymentHistoryCard = () => {
  const { t } = useTranslation();
  const { paymentHistory, getPaymentHistory } = useContext(AppContext);

  useEffect(() => {
    getPaymentHistory();
  }, []);

  return (
    <div>
      <h5 className="text-center mb-3">{t("payment_history")}</h5>
      {paymentHistory?.length > 0 ? (
        <div className="table-responsive p-2">
          <table className="table table-bordered table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("name")}</th>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("date")}</th>
                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("total_bill")}</th>
                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("from_date")}</th>
                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("to_date")}</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((tx, index) => {
                const formattedDate = new Date(tx.date).toISOString().split("T")[0];
                const formattedFromDate = new Date(tx.fromDate).toISOString().split("T")[0];
                const formattedToDate = new Date(tx.toDate).toISOString().split("T")[0];
                return (
                  <tr key={index}>
                    <td>{tx.farmerName}</td>
                    <td>{formattedDate}</td>
                    <td>₹{tx.finalBill}</td>
                    <td>{formattedFromDate}</td>
                    <td>{formattedToDate}</td>
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

export default PaymentHistoryCard;
