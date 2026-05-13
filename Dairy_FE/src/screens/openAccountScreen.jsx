import React, { useEffect, useState } from 'react'
import { PushSpinner } from 'react-spinners-kit';
import getHeaders from '../api/header';
import api from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import UserNavbar from '../components/UserNavbar';
import { updateUser } from '../featurs/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OpenAccountScreen() {
    const [userData, setUserData] = useState({
        phone: '',
        mPin: '',
        amount: '',
        accountType: 'saving'
    });
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    let data = useSelector((state) => state.users);
    useEffect(() => {
        if (data[0] === undefined) {
            const localData = localStorage.getItem('userData');
            if (localData) {
                dispatch(updateUser(JSON.parse(localData)));
                data=JSON.parse(localData)
            }
            else{
                navigate('/');
            }
            
        }
    }, [data, navigate]);

    const submitForm = () => {
        console.log(userData);
        setLoading(true);
        const { phone, mPin, amount, accountType } = userData;
        const apiUrl = 'account/open_account/';
        api.post(
            apiUrl,
            {
                phone, mPin, amount, accountType,
            },getHeaders(data[0].access_token),
        ).then((response) => {
            console.log(response);
            console.log(response);
            toast.success(response.data.message);

        }).catch((error) => {
            console.log(error)
            toast.error(error.response.data.message);
        }).finally(() => {
            setLoading(false);
        })
    }
    return (
        <div className='container-fluid'>
            <UserNavbar />
            <ToastContainer/>
            <div className="container">
                <h3>Please Fill Form To Open Account</h3>
                <p className='text-danger'>*(Before Fill the form , make sure you registered yourself through website)</p>
                <div className="form text-start p-3">
                    <div className="form-floating  mb-3">
                        <input type="text" className="form-control" id="fName" placeholder="Mobile Number"
                            onChange={(e) =>
                                setUserData({ ...userData, phone: e.target.value.trim() })
                            }
                        />
                        <label htmlFor="fName">Mobile Number</label>
                    </div>
                    <div className="form-floating  mb-3">
                        <input type="text" className="form-control" id="fName" placeholder="Amount"
                            onChange={(e) =>
                                setUserData({ ...userData, amount: e.target.value.trim() })
                            }
                        />
                        <label htmlFor="fName">Amount</label>
                    </div>
                    <div className=" mb-3">
                        <select name="" className='form-select' id=""
                            onChange={(e) =>
                                setUserData({ ...userData, accountType: e.target.value.trim() })
                            }
                        >
                            <option value="saving">Saving Account</option>
                            <option value="current">Current Account</option>
                        </select>

                    </div>
                    <div className="form-floating  mb-3">
                        <input type="text" className="form-control" id="fName" placeholder="M-pin"
                            onChange={(e) =>
                                setUserData({ ...userData, mPin: e.target.value.trim() })
                            }
                        />
                        <label htmlFor="fName">Choose 4 digit M-pin</label>
                    </div>
                    <div className='text-center my-2'>
                        <button id="signupButton" className="btn btn-success w-75 text-center"
                            onClick={submitForm}
                        >
                            {
                                loading ? (
                                    <div className="container  d-flex justify-content-center align-items-center">
                                        <PushSpinner size={30} color="white" />
                                    </div>
                                ) : 'Open Account'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenAccountScreen