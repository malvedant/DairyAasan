import React, { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../Context/AppContext";

const PriceFatTable = () => {
  const { milkPriceHistory, getmilkPriceHistory } = useContext(AppContext);
  const { t } = useTranslation();

  useEffect(() => {
    getmilkPriceHistory();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // ✅ GET TODAY RECORD
  const todaysRecord = useMemo(() => {
    return milkPriceHistory.find((record) => {
      const recordDate = new Date(record.date)
        .toISOString()
        .split("T")[0];
      return recordDate === today;
    });
  }, [milkPriceHistory]);

  // ✅ FAT VALUES
  const fatCategories = [2, 3, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10];

  // ✅ DEFAULT SNF VALUE
  const DEFAULT_SNF = 8.5;

  return (
    <div className="container mt-4 mb-5">
      <h5 className="text-center mb-3">
        {t("price_according_fat")}
      </h5>

      <div className="table-responsive p-2">
        <table className="table table-bordered table-striped table-hover text-center align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>{t("date")}</th>
              <th>{t("fat")}</th>
              <th>{t("price")}</th>
            </tr>
          </thead>

          <tbody>
            {fatCategories.map((fat, index) => {
              if (!todaysRecord) {
                return (
                  <tr key={index}>
                    <td>{today}</td>
                    <td>{fat}%</td>
                    <td className="text-muted">
                      {t("no_data")}
                    </td>
                  </tr>
                );
              }

              const fatRate = Number(todaysRecord.fatRate) || 0;
              const snfRate = Number(todaysRecord.snfRate) || 0;

              // ✅ NEW PRICE FORMULA
              const price =
                fat * fatRate + DEFAULT_SNF * snfRate;

              return (
                <tr key={index}>
                  <td>{today}</td>
                  <td>{fat}%</td>
                  <td className="fw-bold text-primary">
                    ₹{price.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceFatTable;