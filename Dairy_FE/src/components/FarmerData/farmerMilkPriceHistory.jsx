import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';
import { useTranslation } from 'react-i18next';

const FFarmersMilkPriceHistory = () => {
    const { t } = useTranslation(); // initialize translation
    const { userData, backendUrl } = useContext(AppContext);
    const [milkTransactions, setMilkTransactions] = useState([]);

    useEffect(() => {
        const getTodaysMilkPrice = async () => {
            try {
                const response = await axios.post(`${backendUrl}/api/D_owner/get-farmer-milkPrice-history`, {
                    farmer_id: userData.id,
                    D_owner_id: userData.D_owner_id,
                });

                if (response.data.success) {
                    setMilkTransactions(response.data.data);
                }
            } catch (error) {
                toast.error(error.message || t("failed_fetch")); // use translation
            }
        };

        getTodaysMilkPrice();
    }, [backendUrl, userData, t]);

    return (
        <div>
            <h5 className="text-left mb-3">{t("milk_rates_history")}</h5>
            {milkTransactions.length > 0 ? (
                <div className="table-responsive p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>{t("name")}</th>
                                <th>{t("date")}</th>
                                <th>{t("shift")}</th>
                                <th>{t("fat")}</th>
                                <th>{t("price")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milkTransactions.map((tx, index) => (
                                <tr key={index}>
                                    <td>{tx.farmerName}</td>
                                    <td>{new Date(tx.date).toISOString().split("T")[0]}</td>
                                    <td>{tx.shift}</td>
                                    <td>{tx.fat}</td>
                                    <td>₹{tx.price}</td>
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

export default FFarmersMilkPriceHistory;
