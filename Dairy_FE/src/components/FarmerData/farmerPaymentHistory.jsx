import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';
import { useTranslation } from "react-i18next";

const FFarmersPaymentHistory = () => {
    const { t } = useTranslation();
    const { userData, backendUrl } = useContext(AppContext);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        const getPaymentHistory = async () => {
            try {
                const response = await axios.post(`${backendUrl}/api/D_owner/get-farmer-Paymnet-Transaction`, {
                    farmer_id: userData.id,
                    D_owner_id: userData.D_owner_id,
                });

                if (response.data.success) {
                    setPaymentHistory(response.data.data);
                }
            } catch (error) {
                toast.error(error.message || t("error_fetch"));
            }
        };

        getPaymentHistory();
    }, [backendUrl, userData, t]);

    return (
        <div>
            <h5>{t("payment_history")}</h5>

            {paymentHistory.length > 0 ? (
                <div className="table-responsive p-2">
                    <table className="table table-bordered table-striped" style={{ fontSize: "16px" }}>
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: "20%", whiteSpace: "nowrap", textAlign: "center" }}>{t("name")}</th>
                                <th style={{ width: "20%", whiteSpace: "nowrap", textAlign: "center" }}>{t("payment_date")}</th>
                                <th style={{ width: "20%", whiteSpace: "nowrap", textAlign: "center" }}>{t("amount")}</th>
                                <th style={{ width: "15%", whiteSpace: "nowrap", textAlign: "center" }}>{t("from_date")}</th>
                                <th style={{ width: "20%", whiteSpace: "nowrap", textAlign: "center" }}>{t("to_date")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((tx, index) => {
                                const formattedDate = new Date(tx.date).toISOString().split("T")[0];
                                const formattedFromDate = formattedDate; // Assuming same as tx.date
                                const formattedToDate = formattedDate;   // Assuming same as tx.date
                                return (
                                    <tr key={index}>
                                        <td className="text-center">{tx.farmerName}</td>
                                        <td className="text-center">{formattedDate}</td>
                                        <td className="text-center">₹{tx.finalBill}</td>
                                        <td className="text-center">{formattedFromDate}</td>
                                        <td className="text-center">{formattedToDate}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">{t("no_transactions")}</p>
            )}
        </div>
    );
};

export default FFarmersPaymentHistory;
