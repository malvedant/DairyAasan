import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";
import UserNavbar from "../components/UserNavbar";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import TodaysMilkCountDetailsCard from "../components/todaysMilkCoutDetailsCard.jsx";

function AddMilkCount() {
  const [loading, setLoading] = useState(false);
  const [fetchingMilk, setFetchingMilk] = useState(false);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");
  const [price, setPrice] = useState(0);

  const [rate, setRate] = useState({ fatRate: 0, snfRate: 0 });

  const [liters, setLiters] = useState("");
  const [totalValue, setTotalValue] = useState(0);

  const [shift, setShift] = useState("Morning");

  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [farmerName, setFarmerName] = useState("");

  const [todaysMilkdata, setTodaysMilkdata] = useState([]);

  const { backendUrl, userData, farmersData,getTodaysMilkCountDetails } = useContext(AppContext);

  const navigate = useNavigate();

  // ✅ FETCH TODAY DATA (RIGHT CARD)
  const fetchTodayData = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-todays-milkcount`,
        {
          date,
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        setTodaysMilkdata(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ GET RATE
  const getTodaysMilkPrice = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-todays-milkprice`,
        {
          date,
          D_owner_id: userData.id,
        }
      );

      if (data.success && data.data) {
        setRate({
          fatRate: Number(data.data.fatRate) || 0,
          snfRate: Number(data.data.snfRate) || 0,
        });
      } else {
        setRate({ fatRate: 0, snfRate: 0 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching rate");
    }
  };

  // ✅ FETCH MILK DATA
  const getMilkData = async () => {
    if (!date || !selectedFarmer) {
      toast.error("Please select farmer and date");
      return;
    }

    if (rate.fatRate === 0 && rate.snfRate === 0) {
      toast.error("Set milk rate first");
      return;
    }

    setFetchingMilk(true);

    try {
      const res = await axios.get(
        `${backendUrl}/api/D_owner/get-milk-data`,
        {
          params: { farmer_name: farmerName },
        }
      );

      const response = res.data;

      let fatVal, snfVal, litersVal;

      if (Array.isArray(response.data)) {
        [fatVal, snfVal, litersVal] = response.data;
      } else {
        [fatVal, snfVal, litersVal] = JSON.parse(response.data);
      }

      fatVal = parseFloat(fatVal);
      snfVal = parseFloat(snfVal);
      litersVal = parseFloat(litersVal);

      setFat(fatVal);
      setSnf(snfVal);
      setLiters(litersVal);

      // ✅ PRICE CALCULATION (2 DECIMAL)
      const calculatedPrice =
        fatVal * rate.fatRate + snfVal * rate.snfRate;

      setPrice(Number(calculatedPrice.toFixed(2)));

      toast.success("Milk data fetched");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching milk data");
    } finally {
      setFetchingMilk(false);
    }
  };

  // ✅ TOTAL VALUE (2 DECIMAL)
  useEffect(() => {
    const total =
      (parseFloat(price) || 0) * (parseFloat(liters) || 0);

    setTotalValue(Number(total.toFixed(2)));
  }, [price, liters]);
   useEffect(() => {
      getTodaysMilkCountDetails();
    }, []);

  // ✅ LOAD RATE + DATA ON DATE CHANGE
  useEffect(() => {
    if (date) {
      getTodaysMilkPrice();
      fetchTodayData();
    }
  }, [date]);

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!date || !fat || !price || !selectedFarmer || !liters) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/add-farmer-milkcount`,
        {
          date,
          fat,
          price,
          liters,
          shift,
          D_owner_id: userData.id,
          farmer_id: selectedFarmer,
          total_value: totalValue,
        }
      );

      if (data.success) {
        toast.success("Added successfully");
       await getTodaysMilkCountDetails()

        // ✅ REFRESH RIGHT SIDE DATA
        await fetchTodayData();

        // ✅ RESET FORM
        setFat("");
        setSnf("");
        setLiters("");
        setFarmerName("");
        setSelectedFarmer("");
        setTotalValue(0);
        setPrice(0);
        setShift("Morning");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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

      <div className="shadow rounded m-4 p-4 d-flex flex-row">
        <div className="container">
          <div className="container col-md-7">

            {/* FARMER */}
            <div className="form-floating mb-3">
              <select
                className="form-select"
                value={selectedFarmer}
                onChange={(e) => {
                  const selected = farmersData.find(
                    (f) => f._id === e.target.value
                  );
                  setSelectedFarmer(e.target.value);
                  setFarmerName(selected ? selected.name : "");
                }}
              >
                <option value="">Select Farmer</option>
                {farmersData?.map((farmer) => (
                  <option key={farmer._id} value={farmer._id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
              <label>Select Farmer</label>
            </div>

            {/* SHIFT */}
            <div className="form-floating mb-3">
              <select
                className="form-select"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
              <label>Shift</label>
            </div>

            {/* DATE */}
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <label>Date</label>
            </div>

            {/* BUTTON */}
            <div className="text-center mb-3">
              <button
                className="btn btn-primary w-50"
                onClick={getMilkData}
              >
                {fetchingMilk ? "Fetching..." : "Get Milk Data"}
              </button>
            </div>

            {/* OUTPUT */}
            <div className="form-floating mb-3">
              <input className="form-control" value={fat} readOnly />
              <label>Fat</label>
            </div>

            <div className="form-floating mb-3">
              <input className="form-control" value={snf} readOnly />
              <label>SNF</label>
            </div>

            <div className="form-floating mb-3">
              <input className="form-control" value={price} readOnly />
              <label>Price</label>
            </div>

            <div className="form-floating mb-3">
              <input className="form-control" value={liters} readOnly />
              <label>Liters</label>
            </div>

            <div className="form-floating mb-3">
              <input className="form-control" value={totalValue} readOnly />
              <label>Total Value</label>
            </div>

            {/* SUBMIT */}
            <div className="text-center my-2">
              <button
                className="btn btn-success w-75"
                onClick={handleSubmit}
              >
                {loading ? (
                  <PushSpinner size={30} color="white" />
                ) : (
                  "Add Data"
                )}
              </button>
            </div>

          </div>
        </div>

        {/* ✅ PASS UPDATED DATA */}
        <TodaysMilkCountDetailsCard todaysMilkdata={todaysMilkdata} />
      </div>
    </div>
  );
}

export default AddMilkCount;