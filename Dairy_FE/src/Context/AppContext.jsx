import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const AppContext = createContext();


export const AppContextProvider = ({ children }) => {
  const navigate=useNavigate();
  axios.defaults.withCredentials = true;

  const backendUrl = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [milkprice, setMilkprice] = useState("");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [totalCowFeedBags, setTotalCowFeedBags] = useState(0);
  const [totalCowFeedPrice, setTotalCowFeedPrice] = useState(0);
  const [todaysCowFeedData, setTodaysCowFeedData] = useState([]);
  const [milkPriceHistory, setMilkPriceHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [emiTransctions, setEmiTransactions] = useState([]);
  const [farmersData, setFarmersData] = useState(
    JSON.parse(localStorage.getItem("farmersData")) || null
  );
  const [advancePaymentData, setAdvancePayentData] = useState(
    JSON.parse(localStorage.getItem("advancePaymentData")) || null
  );
  const [todaysMilkData, setTodaysMilkData] = useState(null);
  const [cowFeedData, setCowFeedData] = useState(null);
  console.log(userData);
  console.log(farmersData);

  
  const getUserData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData));
        if (data.userData && data.userData.role === "dairy-owner") {
          await getFarmersData();
          await getCowFeedDetails();
          await getAllAdvancePayment();
          navigate("/User-DashBord");
      }
      else if(data.userData && data.userData.role === "farmer"){

      navigate("/farmer-screen");
      }
       else {
          console.warn("userData is null or role is undefined");
      }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  const getFarmersData = async () => {
    const role = "farmer";
    try {
      console.log(userData.id);
      console.log(role);
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-all-farmers`,
        {
          D_owner_id: userData.id,
          role,
        }
      );

      if (data.success) {
        setFarmersData(data.data);
        localStorage.setItem("farmersData", JSON.stringify(data.data));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };
  const getTodaysMilkPrice = async (req, res) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/D_owner/get-todays-milkprice`,
        {
          D_owner_id: userData.id,
        }
      );
      if (data.success) {
        setMilkprice(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteFarmer = async (farmerID) => {
    const role = "farmer";
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/delete-farmer`,
        {
          farmer_id: farmerID,
        }
      );

      if (data.success) {
        return data.message;
        // return toast.success(data.message);
      } else {
        return data.message;
       
      }
    } catch (error) {
      return error.response?.data?.message || "Failed to fetch user data";
     
    }
  };

  const getTodaysMilkCountDetails = async () => {
    try {
     
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; 
      const istTime = new Date(now.getTime() + istOffset);

      const date = istTime.toISOString().split("T")[0];

      console.log("Date: " + date);
      console.log("Fetching milk count details...");

      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/todays-milk-count-details`,
        {
          date: date,
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        setTodaysMilkData(data.data);

        localStorage.setItem("todaysMilkData", JSON.stringify(data.data));

        console.log("Milk count details updated successfully.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching milk count details."
      );
    }
  };
  const getCowFeedDetails = async () => {
   
    if (!userData || !userData.id) {
      console.error("User ID is missing. Cannot fetch cow feed details.");
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-cowfeed-details`,
        {
          D_owner_id: userData.id, 
        }
      );

      if (data.success) {
        console.log("Cow feed data fetched successfully:", data.data);
        setCowFeedData(data.data);
        localStorage.setItem("cowFeedData", JSON.stringify(data.data));
      } else {
        toast.error(data.message || "Failed to fetch cow feed details.");
      }
    } catch (error) {
      console.error("Error fetching cow feed details:", error);
      toast.error(
        error.response?.data?.message || "Error fetching cow feed details."
      );
    }
  };

  const getAllAdvancePayment = async (req, res) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/D_owner/get-all-advance-payment-list",
        { D_owner_id: userData.id }
      );
      if (data.success) {
        setAdvancePayentData(data.data);
        localStorage.setItem("advancePaymentData", JSON.stringify(data.data));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching Advance Payment details."
      );
    }
  };

  const calculatedTotalCowFeedAndPrice = async () => {
    if (!userData?.id || !todaysCowFeedData?.date) return; 

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/D_owner/calculate-todays-cowFeed-price-bags",
        {
          D_owner_id: userData.id,
          date: todaysCowFeedData.date,
        }
      );

      if (data.success) {
        setTotalCowFeedBags(data.totalAllocatedBags);
        setTotalCowFeedPrice(data.totalcowFeedPrice);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTodaysCowFeedDetails = async () => {
    try {
      console.log("in c 1");
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; 
      const istTime = new Date(now.getTime() + istOffset);

      const date = istTime.toISOString().split("T")[0];

      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-All-cowfeed-transactions-asper-date`,
        {
          date: date,
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        await calculatedTotalCowFeedAndPrice();
        setTodaysCowFeedData(data.data);

        localStorage.setItem("todaysCowFeedData", JSON.stringify(data.data));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching milk count details."
      );
    }
  };
  const getmilkPriceHistory = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-milk-price-history`,
        {
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        setMilkPriceHistory(data.data);

        localStorage.setItem("milkPriceHistory", JSON.stringify(data.data));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching milk count details."
      );
    }
  };
  const getPaymentHistory = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-all-payment-transaction`,
        {
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        setPaymentHistory(data.data);

        localStorage.setItem("paymentHistory", JSON.stringify(data.data));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching milk count details."
      );
    }
  };
  const getEmiTransactionHistory = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/D_owner/get-all-DairyOwnerEmiTransactions`,
        {
          D_owner_id: userData.id,
        }
      );

      if (data.success) {
        setEmiTransactions(data.data);
       localStorage.setItem("emiTransaction", JSON.stringify(data.data));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching milk count details."
      );
    }
  };
  useEffect(() => {
    getUserData();
  }, []); 
  
  useEffect(() => {
    if (userData && userData.role === "dairy-owner") {
      getFarmersData();
      getCowFeedDetails();
      getAllAdvancePayment();
    }
  }, [userData]); 
  

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        token,
        getTodaysMilkPrice,
        getEmiTransactionHistory,
        emiTransctions,
        userData,
        getUserData,
        setUserData,
        getFarmersData,
        farmersData,
        setFarmersData,
        deleteFarmer,
        milkPriceHistory,
        getmilkPriceHistory,
        getTodaysCowFeedDetails,
        todaysCowFeedData,
        milkprice,
        getTodaysMilkCountDetails,
        todaysMilkData,
        getCowFeedDetails,
        getAllAdvancePayment,
        advancePaymentData,
        totalCowFeedBags,
        totalCowFeedPrice,
        paymentHistory,
        getPaymentHistory,
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
