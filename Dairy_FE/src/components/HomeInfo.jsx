import React from 'react'
import img from '../assetes/Dairy/homeOne.png'
import recharge from '../assetes/Dairy/cardOne.jpg'
import transaction from '../assetes/Dairy/cardTwo.png'
import account from '../assetes/Dairy/cardThree.webp'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
function HomeInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const gotToSignUp = () => {
    navigate('/signup');
  }
  return (
    <div className="container">
      <div className="col-md-12 homeInfo d-flex justify-content-center align-items-center">
        <div data-aos="fade-right" className=' p-3'>
         <h2 className='my-4'>
  <span dangerouslySetInnerHTML={{ __html: t("dairy_asaan_title") }}></span>
</h2>

     
          <p className='my-4'> {t("dairy_operations")}</p>
          <button onClick={gotToSignUp} className='btn btn-success rounded w-50 '> {t('signup_now')}</button>
        </div>
        <div data-aos="fade-left" className=' p-3'>
          <img className='img-fluid' src={img} alt="Bank Image" />
        </div>
      </div>
      <div className="container my-3 row">
       <h3
      className="text-center my-3"
      dangerouslySetInnerHTML={{ __html: t("dairy_business") }}
    />
        <div data-aos="fade-up" className="col-md-4 mb-4">
          <div  className="card mx-auto rounded shadow p-3 border border-none" style={{ width: '25rem' }}>
            <img src={transaction} className="card-img-top" alt="Milk Status" />
            <h4>{t("milk_collection_status")}</h4>
            <p> {t("milk_tracking")}</p>
          </div>
        </div>

        <div data-aos="fade-up" className="col-md-4 mb-4">
          <div className="card mx-auto rounded shadow p-3 my-3 border border-none" style={{ width: '25rem' }}>
            <img src={account} className="card-img-top" alt="Simple UI" />
            <h4> {t("farmer_friendly_interface")}</h4>
            <p> {t("easy_navigation")}</p>
          </div>
        </div>

        <div data-aos="fade-up" className="col-md-4 mb-4">
          <div className="card mx-auto rounded shadow p-3 border border-none" style={{ width: '25rem' }}>
            <img src={recharge} className="card-img-top" alt="Record Handling" />
            <h4>  {t("record_management")}</h4>
            <p>{t("record_details")}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomeInfo