import React from 'react'
import Navbar from '../components/Navbar'
import HomeInfo from '../components/HomeInfo'
import Footer from '../components/Footer'


function home() {
  return (
    <div className="container-fluid">
       <Navbar/>
       <HomeInfo/>
       <Footer/>
    </div>
  )
}

export default home