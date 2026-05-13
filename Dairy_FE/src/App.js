import './App.css';
import { Route, Routes } from 'react-router-dom'; // ✅ Removed BrowserRouter
import 'bootstrap/dist/css/bootstrap.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import "./i18n";

import {
  Login, CowFeed, Contact, UserDashBord, Home, Signup, 
  UpdateProfile, OpenAccountScreen,DairyData,FarmersData,FarmerScreen, MilkDailyCard,BillPayment,AdvancePayment,AllocateCowFeed,FarmersList,AddFarmers,SetMilkPrice,AddMilkCount,AddNewCowFeed,UpdateCowFeed,
  DairyAi
} from './screens/index';



function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200, 
      easing: 'ease-in-out', 
      once: false, 
      mirror: false, 
    });
  }, []);

  return (
    <div className="page-body">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserDashBord />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cow-feed-availability" element={<CowFeed />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/create-account" element={<OpenAccountScreen />} />
        <Route path="/update-cow-feed" element={<UpdateCowFeed />} />
        <Route path="/allocate-cowfeed" element={<AllocateCowFeed />} />
        <Route path="/add-new-cowFeed" element={<AddNewCowFeed/>} />
        <Route path="/User-DashBord" element={<UserDashBord />} />
        <Route path="/farmers-list" element={<FarmersList/>} />
        <Route path="/add-farmer" element={<AddFarmers/>} />
        <Route path="/set-milk-price" element={<SetMilkPrice/>} />
        <Route path="/add-milk-count" element={<AddMilkCount/>} />
        <Route path="/make-advance-payment" element={<AdvancePayment/>} />
        <Route path="/dairy-data-screen" element={<DairyData/>} />
        <Route path="/bill-payment" element={<BillPayment/>} />
        <Route path="/farmers-data" element={<FarmersData/>} />
        <Route path="/farmer-screen" element={<FarmerScreen/>} />
         <Route path="/dairy-ai" element={<DairyAi/>} />

      </Routes>
    </div>
  );
}

export default App;
