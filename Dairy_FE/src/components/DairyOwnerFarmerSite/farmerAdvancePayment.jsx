import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';
import { AdvancePayment } from '../../screens';
import { useTranslation } from "react-i18next";

const FarmersAdvancePayment = ({ currentIndex }) => {
  const { farmersData, userData, backendUrl } = useContext(AppContext);
  const [advancePaymentTransactions, setAdvancePaymentTransactions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!farmersData || !farmersData[currentIndex]) return; // Ensure farmerData is available

    const getAdvancePayment = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/D_owner/get-farmer-advance-payment`, {
          farmer_id: farmersData[currentIndex]._id,
          D_owner_id: userData.id
        });

        if (response.data.success) {
          setAdvancePaymentTransactions(response.data.data);
        }
      } catch (error) {
        toast.error(error.message || t("failed_fetch"));
      }
    };

    getAdvancePayment();
  }, [currentIndex, farmersData, backendUrl, userData, t]);

  if (!farmersData || !farmersData[currentIndex]) {
    return <p className="text-danger">{t("no_farmer_data")}</p>;
  }

  return (
    <div>
      <h5 className="text-left mb-3">{t("milk_transactions")}</h5>
      {advancePaymentTransactions.length > 0 ? (
        <div className="table-responsive p-2">
          <table className="table table-bordered table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th>{t("name")}</th>
                <th>{t("amount")}</th>
                <th>{t("allocated_date")}</th>
                <th>{t("emi")}</th>
                <th>{t("expire_date")}</th>
              </tr>
            </thead>
            <tbody>
              {advancePaymentTransactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.farmerName}</td>
                  <td>₹{tx.advancePayment}</td>
                  <td>{new Date(tx.date).toISOString().split("T")[0]}</td>
                  <td>₹{tx.monthlyEmi}</td>
                  <td>{new Date(tx.emiExpireDate).toISOString().split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">{t("no_transactions")}</p>
      )}
    </div>
  );
};

export default FarmersAdvancePayment;
