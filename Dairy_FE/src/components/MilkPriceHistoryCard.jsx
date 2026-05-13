import React, { useContext, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';
import { useTranslation } from 'react-i18next';

const MilkPriceHistoryCard = () => {
    const { t } = useTranslation();
    const { milkPriceHistory, getmilkPriceHistory } = useContext(AppContext);

    useEffect(() => {
        getmilkPriceHistory();
    }, [milkPriceHistory]);

    return (
        <div>
            <h5 className="text-center mb-3">{t("milk_transactions")}</h5>
            {milkPriceHistory.length > 0 ? (
                <div className="table-responsive p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("date")}</th>
                                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("fat")}</th>
                                <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("price")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milkPriceHistory.map((tx, index) => {
                                const formattedDate = new Date(tx.date)
                                    .toISOString()
                                    .split("T")[0];
                                return (
                                    <tr key={index}>
                                        <td>{formattedDate}</td>
                                        <td>{tx.fat}</td>
                                        <td>₹{tx.price}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">{t("no_milk_price_history")}</p>
            )}
        </div>
    );
};

export default MilkPriceHistoryCard;
