import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { PushSpinner } from "react-spinners-kit";
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';
import { useTranslation } from "react-i18next";

const FFarmerTenDaysMilkCollection = () => {
    const { t } = useTranslation();
    const [toDate, setToDate] = useState('');
    const { userData } = useContext(AppContext);
    const [milkTransactions, setMilkTransactions] = useState([]);
    const [totalMilkCount, setTotalMilkcount] = useState(0);
    const [totalMilkPrice, setTotalMilkPrice] = useState(0);
    const [fromDate, setFromDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:4000/api/D_owner/get-farmer-Ten-Days-Milk-Collection", {
                D_owner_id: userData.D_owner_id,
                farmer_id: userData.id,
                fromDate,
                toDate,
            });
            if (data.success) {
                setMilkTransactions(data.transactions);
                setTotalMilkPrice(data.totalMilkPrice);
                setTotalMilkcount(data.totalMilkCount);
            }
        } catch (error) {
            toast.error(error.message || t("error_fetch"));
        }
        setLoading(false);
    }

    return (
        <div>
            <div>
                <div className="form-floating mb-3">
                    <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <label>{t("from_date")}</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    <label>{t("to_date")}</label>
                </div>

                <div className="text-center my-2 d-flex gap-4">
                    <button
                        className="btn btn-success w-75"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <PushSpinner size={30} color="white" /> : t("find")}
                    </button>
                </div>
            </div>

            <div>
                <h5 className="text-left mb-3">{t("milk_transactions")}</h5>
                {milkTransactions.length > 0 ? (
                    <div className="table-responsive p-2">
                        <table className="table table-bordered table-striped table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("name")}</th>
                                    <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("date")}</th>
                                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("shift")}</th>
                                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("fat")}</th>
                                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("price")}</th>
                                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("liters")}</th>
                                    <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("total_value")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {milkTransactions.map((tx, index) => {
                                    const formattedDate = new Date(tx.date).toISOString().split("T")[0];
                                    return (
                                        <tr key={index}>
                                            <td>{tx.farmerName}</td>
                                            <td>{formattedDate}</td>
                                            <td>{tx.shift}</td>
                                            <td>{tx.fat}</td>
                                            <td>₹{tx.price}</td>
                                            <td>{tx.liters}</td>
                                            <td>₹{tx.total_value}</td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            height: "40px",
                                            fontWeight: "bold",
                                            textAlign: "left",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {t("final_total_milk_price")} ₹{totalMilkPrice}, {t("final_total_milk_count")} {totalMilkCount} {t("liters_label")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">{t("no_transactions")}</p>
                )}
            </div>
        </div>
    )
}

export default FFarmerTenDaysMilkCollection;
