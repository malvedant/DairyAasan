import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";
import UserNavbar from "../components/UserNavbar";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

function BillPayment() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [date, setDate] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [milkTransactions, setMilkTransactions] = useState([]);
  const [emiTransactions, setEmiTransactions] = useState([]);
  const [cowFeedTransactions, setCowFeedTransactions] = useState([]);
  const [emi, setEmi] = useState(null);
  const [total_MilkPrice, setTotal_MilkPrice] = useState(null);
  const [total_CowFeedPrice, setTotal_CowFeedPrice] = useState(null);
  const [final_Price, setFinal_Price] = useState(null);
  const [final_farmer, setFinal_farmer] = useState("");
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [sendMailLoading, setSendMailLoading] = useState(false);
  const { backendUrl, userData, farmersData } = useContext(AppContext);
  const [showMakeTransactionBillButton, setShowTransactionBillButton] =
    useState(true);

  useEffect(() => {
    const currentDate = new Date(Date.now()).toISOString().split("T")[0];
    setDate(currentDate);
  }, []);

  const navigate = useNavigate();

  const makeEmiPayment = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/D_owner/make-emi-payment",
        {
          startDate: fromDate,
          toDate,
          fromDate,
          D_owner_id: userData.id,

          farmer_id: selectedFarmer,
          date,
        }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !selectedFarmer) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/generate-bill`,
        {
          startDate: fromDate,
          endDate: toDate,
          D_owner_id: userData.id,
          farmer_id: selectedFarmer,
        }
      );

      if (data.success) {
        toast.success(data.success);
        setShowPaymentButton(true);
        setMilkTransactions(data.milkTransactions);
        setCowFeedTransactions(data.cowFeedTransactions);
        setTotal_MilkPrice(data.total_MilkPrice);
        setTotal_CowFeedPrice(data.total_CowFeedprice);
        setEmi(data.emi_Price);
        setEmiTransactions(data.emiTransactions);
        setFinal_Price(data.Final_Price);
        setFinal_farmer(data.farmer);
        setEndDate(data.endDate);
        setStartDate(data.startDate);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
      setShowTransactionBillButton(false);
    }
  };

  const handleSendMail = async (req, res) => {
    setSendMailLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/send-milk-transaction-file`,
        {
          startDate: fromDate,
          endDate: toDate,
          D_owner_id: userData.id,
          D_owner_email: userData.email,
          farmer_id: selectedFarmer,
        }
      );
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setSendMailLoading(false);
    }
  };

  const handleMakePayment = async (req, res) => {
    setPaymentLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/make-payment`,
        {
          fromDate,
          toDate,
          D_owner_id: userData.id,
          date,
          farmer_id: selectedFarmer,
          emi,
          finalBill: final_Price,
          milkBill: total_MilkPrice,
          cowFeedBill: total_CowFeedPrice,
        }
      );
      if (data.success) {
        toast.success(data.message);
        await makeEmiPayment();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="back-arrow position-absolute top-5 start-0 p-3">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2x"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
      </div>
      <ToastContainer />
      <div className="shadow rounded m-4 p-4 d-flex flex-row ">
        <div className="container col-md-7" style={{ width: "30%" }}>
          <div className="form-floating mb-3">
            <select
              className="form-select"
              value={selectedFarmer}
              onChange={(e) => setSelectedFarmer(e.target.value)}
            >
              <option value="" disabled>
               {t("selectFarmer")}
              </option>
              {farmersData?.map((farmer) => (
                <option key={farmer._id} value={farmer._id}>
                  {farmer.name}
                </option>
              ))}
            </select>
            <label> {t("selectFarmer")}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label>{t("fromDateLabel")}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <label>{t("toDateLabel")}</label>
          </div>

          <div className="text-center my-2 d-flex gap-4">
            {showMakeTransactionBillButton && (
              <button
                className="btn btn-success w-75"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <PushSpinner size={30} color="white" />
                ) : (
                 t("makeTransactionBill")
                )}
              </button>
            )}

            {showPaymentButton ? (
              <div className="d-flex  align-items-center gap-3">
                <button
                  className="btn btn-success  m-10"
                  onClick={handleMakePayment}
                  disabled={loading}
                >
                  {paymentLoading ? (
                    <PushSpinner size={30} color="white" />
                  ) : (
                     t("makePaymentBtn")
                  )}
                </button>

                <button
                  className="btn btn-primary  m-10"
                  onClick={handleSendMail}
                  disabled={loading}
                >
                  {sendMailLoading ? (
                    <PushSpinner size={30} color="white" />
                  ) : (
                    t("sendMailBtn")
                  )}
                </button>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
        {/* Right Section - Table */}
        <div
          className="col-md-6 bg-white"
          style={{ maxHeight: "400px", overflowY: "auto", width: "40%" }}
        >
          <h5 className="text-left mb-3"> {t("farmerNameLabel")} : {final_farmer}</h5>

          <h6 className="text-center mb-3">
            {" "}
             {t("transactionReport")} {startDate} {t("to")} {endDate}
          </h6>

          <h5 className="text-left mb-3">{t("milkTransactionsLabel")}</h5>
          {milkTransactions.length > 0 ? (
            <div className="table-responsive p-2">
              <table className="table table-bordered table-striped table-sm">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("date")}</th>
                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>{t("fat")}</th>
                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>
                      {t("price")}
                    </th>
                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>
                    {t("liters")}
                    </th>
                    <th style={{ width: "20%", whiteSpace: "nowrap" }}>
                     
                      {t("total_value")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {milkTransactions.map((tx, index) => {
                    const formattedDate = new Date(tx.date)
                      .toISOString()
                      .split("T")[0];
                    return (
                      <tr key={index}>
                        <td>{formattedDate}</td>
                        <td>{tx.fat}</td>
                        <td>₹{tx.price}</td>
                        <td>{tx.liters}</td>
                        <td>₹{tx.total_value}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        height: "40px",
                        fontWeight: "bold",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                       {t("final_total_milk_price")}  ₹{total_MilkPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted"> {t(" no_transactions_found")} </p>
          )}

 {/* "milkTransactions": "Milk Transactions",
  "cowFeedTransactions": "Cow Feed Transactions",
  "emiTransaction": "EMI Transaction",
  "date": "Date",
  "fat": "Fat",
  "price": "Price",
  "liters": "Liters",
  "totalValue": "Total Value",
  "feedName": "Feed Name",
  "bags": "Bags",
  "installment": "Installment",
  "emi": "EMI",
  "totalPaid": "Total Paid",
  "remaining": "Remaining",
  "noTransactions": "No transactions found",
  "finalTotalMilkPrice": "Final Total Milk Price",
  "finalTotalCowFeedPrice": "Final Total CowFeed Price",
  "finalValue": "Final Value" */}



          <h5 className="text-left mb-3">  {t("cowFeedTransactionsLabel")}</h5>
          {cowFeedTransactions.length > 0 ? (
            <div className="table-responsive p-2">
              <table className="table table-bordered table-striped table-sm">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "20%", whiteSpace: "nowrap" }}>{t("date")}</th>
                    <th style={{ width: "25%", whiteSpace: "nowrap" }}>
                      {t("feedName")}
                    </th>
                    <th style={{ width: "10%", whiteSpace: "nowrap" }}>  {t("bags")}</th>
                    <th style={{ width: "15%", whiteSpace: "nowrap" }}>
                      {t("price")}
                    </th>
                    <th style={{ width: "20%", whiteSpace: "nowrap" }}>
                      {t("totalValue")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cowFeedTransactions.map((tx, index) => {
                    const formattedDate = new Date(tx.date)
                      .toISOString()
                      .split("T")[0];
                    return (
                      <tr key={index}>
                        <td>{formattedDate}</td>
                        <td>{tx.cowFeedName}</td>
                        <td>{tx.allocated_bags}</td>
                        <td>₹{tx.price}</td>
                        <td>₹{tx.total_cowFeed_price}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-1 p-2"
                      style={{
                        height: "50px",
                        fontWeight: "bold",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                      {t("finalTotalCowFeedPrice ")} : ₹{total_CowFeedPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">  {t(" no_transactions_found")} </p>
          )}

          <h5> {t("emiTransactionLabel")}   </h5>

          {emiTransactions.length > 0 ? (
            <div
              className="table-responsive p-2"
              style={{ maxWidth: "600px", margin: "auto" }}
            >
              <table
                className="table table-bordered table-striped table-sm"
                style={{ fontSize: "12px" }}
              >
                <thead className="table-dark">
                  <tr>
                    <th
                      style={{
                        width: "20%",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                  {t("date")}
                    </th>
                    <th
                      style={{
                        width: "10%",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                    {t("Installment")} {" "}
                    </th>
                    <th
                      style={{
                        width: "15%",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                   {t("emi")}  
                    </th>
                    <th
                      style={{
                        width: "20%",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                    {t("total_paid")}  
                    </th>
                    <th
                      style={{
                        width: "20%",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                     {t("remaining")} 
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emiTransactions.map((tx, index) => {
                    const formattedDate = new Date(tx.date)
                      .toISOString()
                      .split("T")[0];
                    return (
                      <tr key={index}>
                        <td className="text-center">{formattedDate}</td>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">₹{tx.monthlyEmi}</td>
                        <td className="text-center">
                          ₹{(tx.count ?? 0) * (tx.monthlyEmi ?? 0)}
                        </td>
                        <td className="text-center">
                          ₹{tx.remainingAdvancePrice}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No transactions found.</p>
          )}

          <h5>
           {t("finalValueLabel")}    ₹{total_MilkPrice}-{total_CowFeedPrice}-{emi}
          </h5>

          <h4 className="" style={{ textAlign: "center" }}>
          {t("finalValueLabel")}  :₹{final_Price}{" "}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default BillPayment;
