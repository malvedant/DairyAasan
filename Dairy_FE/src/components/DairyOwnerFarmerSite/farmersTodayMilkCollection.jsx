import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';
import { useTranslation } from "react-i18next";

const FarmersTodayMilkCollection = ({ currentIndex }) => {
    const { t } = useTranslation();
    const { farmersData, userData, backendUrl } = useContext(AppContext);
    const [milkTransactions, setMilkTransactions] = useState([]);
    const [totalMilkPrice, setTotalMilkPrice] = useState(0);
    const [totalMilkCount, setTotalMilkCount] = useState(0);

    useEffect(() => {
        if (!farmersData || !farmersData[currentIndex]) return;

        const getTodaysMilkCollection = async () => {
            try {
                const now = new Date();
                const istOffset = 5.5 * 60 * 60 * 1000;
                const istTime = new Date(now.getTime() + istOffset);
                const date = istTime.toISOString().split("T")[0];

                const response = await axios.post(`${backendUrl}/api/D_owner/calculate-farmers-todays-milk-price-liters`, {
                    farmer_id: farmersData[currentIndex]._id,
                    date,
                    D_owner_id: userData.id
                });

                if (response.data.success) {
                    setMilkTransactions(response.data.transactions);
                    setTotalMilkCount(response.data.totalMilkCount);
                    setTotalMilkPrice(response.data.totalMilkPrice);
                }
            } catch (error) {
                toast.error(error.message || t("failed_fetch"));
            }
        };

        getTodaysMilkCollection();
    }, [currentIndex, farmersData, backendUrl, userData, t]);

    if (!farmersData || !farmersData[currentIndex]) {
        return <p className="text-danger">{t("error_farmer_data")}</p>;
    }

    return (
        <div>
            <h5 className="text-left mb-3">{t("milk_transactions")}</h5>
            {milkTransactions.length > 0 ? (
                <div className="table-responsive p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>{t("name")}</th>
                                <th>{t("date")}</th>
                                <th>{t("fat")}</th>
                                <th>{t("price")}</th>
                                <th>{t("liters")}</th>
                                <th>{t("total_value")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milkTransactions.map((tx, index) => (
                                <tr key={index}>
                                    <td>{tx.farmerName}</td>
                                    <td>{new Date(tx.date).toISOString().split("T")[0]}</td>
                                    <td>{tx.fat}</td>
                                    <td>₹{tx.price}</td>
                                    <td>{tx.liters}</td>
                                    <td>₹{tx.total_value}</td>
                                </tr>
                            ))}
                            <tr>
                                <td
                                    colSpan="5"
                                    style={{ fontWeight: "bold", fontSize: "16px" }}
                                >
                                    {t("final_total_milk_price")}: ₹{totalMilkPrice}, {t("final_total_milk_count")}: {totalMilkCount} {t("liters")}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">{t("no_transactions")}</p>
            )}
        </div>
    );
};

export default FarmersTodayMilkCollection;
