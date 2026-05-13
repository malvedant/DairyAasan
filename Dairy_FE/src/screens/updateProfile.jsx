import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import updateProfile from '../assetes/update.png'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../featurs/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Updatepassword from '../components/modals/updatepassword';
import UpdateMpin from '../components/modals/updateMpin';
import { ToastContainer } from 'react-toastify';
import EmailChangeForm from '../components/modals/emailChangeModal';
import getHeaders from '../api/header';
import api from '../api/api';

function UpdateProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[visible, setVisible]=useState(false)
    const[visiblePin, setVisiblePin]=useState(false)
    const[visibleEmailUpdate, setVisibleEmailUpdate]=useState(false)
    const[userData,setUserData]=useState();
    let data = useSelector((state) => state.users);
    console.log(data[0])
    const userProfile=()=>{
        const apiUrl = 'user/profile/';
        api.get(
            apiUrl,
            {
                getHeaders,
            }
        ).
            then((response) => {
                console.log(response.data.data)
                setUserData(response.data.data);
                dispatch(updateUser(JSON.parse(response.data.data)));
                data=JSON.parse(userData)
            }).
            catch((error) => {
                console.log(error)
            })
    }
    useEffect(() => {
        userProfile()
        if(data){
            if (data[0] == undefined) {
                const localData = localStorage.getItem('userData');
                if (localData) {
                    dispatch(updateUser(JSON.parse(userData)));
                    data=JSON.parse(userData)
                }
                else{
                    navigate('/');
                }
                
            }
        }
       
    }, [data, navigate]);
    
  return (
    <div className='page-body container-fluid'>
        <ToastContainer />
        <UserNavbar/>
        <Updatepassword visible={visible} setVisible={setVisible} />
        <UpdateMpin visiblePin={visiblePin} setVisiblePin={setVisiblePin} />
        <EmailChangeForm visiblePin={visibleEmailUpdate} setVisiblePin={setVisibleEmailUpdate} />
        <div className="back-arrow position-absolute top-5 start-0 p-3">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        </div>
        <div className="container update-body mt-3 d-flex  p-2 border border-success align-items-center rounded  ">
            <div data-aos="fade-right" className="container">
                <div className="">
                    <h4 className='text-start'><strong>Hey</strong> User!</h4>
                    <p>Update Your Profile</p>
                    <label htmlFor="" className='text-start'>User's Name</label>
                    <input type="text" className='form-control' readOnly value={`${data[0].first_name} ${data[0].last_name}`}/>
                    <hr />
                    <label htmlFor="" className='text-start'>User's Mobile</label>
                    <input type="text" className='form-control' readOnly value={data[0].phone_number} />
                    <hr />
                    <label htmlFor="" className='text-start'>User's Email</label>
                    <input type="text" className='form-control' readOnly value={data[0].email} />
                    <hr />
                    <div className="container update-button d-flex  justify-content-center">
                        <button className='btn btn-primary m-1  shadow'>Update Mobile</button>
                        <button className='btn btn-primary m-1  shadow'
                        onClick={()=>{
                            setVisible(true)
                        }}
                        >Update Password</button>
                        <button className='btn btn-primary m-1  shadow' onClick={()=>{
                            setVisibleEmailUpdate(true);
                        }}>Update Email</button>
                        <button className='btn btn-primary m-1  shadow'
                        onClick={()=>{
                            setVisiblePin(true);
                        }}
                        >Update M-pin</button>
                    </div>
                </div>
            </div>
            <div data-aos="fade-left" className="container">
                <img className='img-fluid ' src={updateProfile} alt="" />
            </div>
        </div>
    </div>
  )
}

export default UpdateProfile