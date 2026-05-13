import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../../featurs/userSlice'
import { toast } from 'react-toastify'
import getHeaders from '../../api/header'
import api from '../../api/api'
import { PushSpinner } from 'react-spinners-kit'
import SucessModal from '../modals/sucessModal'


function EmailChnageForm() {
    const [changeEmailPaylaod, setChangeEmailPaylaod] = useState({
        oldEmail: '',
        newEmail: '',
        otp: ''
    })
    const [loadingStatus, setLoadingStatus] = useState({
        otpLoading: false,
        formLoading: false,
        formSubmit: false,
        otpSent: false
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let data = useSelector((state) => state.users);
    useEffect(() => {
        if (data[0] == undefined) {
            const localData = localStorage.getItem('userData');
            if (localData) {
                dispatch(updateUser(JSON.parse(localData)));
                data = JSON.parse(localData)
                setChangeEmailPaylaod({ ...changeEmailPaylaod, oldEmail: data[0].email })
            }
            else {
                navigate('/');
            }

        }
    }, [data, navigate]);
    const sendOtp = () => {
        setLoadingStatus({ ...loadingStatus, otpLoading: true })
        const apiUrl = 'user/update_email/';
        api.post(
            apiUrl,
            {
                updatedMail: changeEmailPaylaod.newEmail,
                getHeaders,
            }
        ).
            then((response) => {
                setLoadingStatus(loadingStatus => ({ ...loadingStatus, otpSent: true, otpLoading: false }));
                // setLoadingStatus({ ...loadingStatus, otpSent: true })
                toast.success(response.data.message);

                console.log(loadingStatus)
            }).
            catch((error) => {
                toast.error(error.response.data.message);
                setLoadingStatus({ ...loadingStatus, otpLoading: false })
            })
    }
    const submitForm = () => {
        setLoadingStatus({ ...loadingStatus, formLoading: true })
        const apiUrl = 'user/update_email_confirm/';
        api.post(
            apiUrl,
            {
                updatedMail: changeEmailPaylaod.newEmail,
                otp: changeEmailPaylaod.otp,
                getHeaders,
            }
        ).
            then((response) => {
                setLoadingStatus(loadingStatus => ({ ...loadingStatus, formSubmit: true, formLoading: false }));
                toast.success(response.data.message);
            }).
            catch((error) => {
                toast.error(error.response.data.message);
                setLoadingStatus({ ...loadingStatus, formLoading: false })
            })
    }
    return (
        !loadingStatus.formSubmit ?(<div className="container">
            <div className="">
                <div className="form-floating  mb-3">
                    <input type="email" className="form-control" id="oldEmail" placeholder="Old Email"
                        readOnly={true} value={data[0].email}
                    />
                    <label htmlFor="mobile">Old Email</label>
                </div>
                <div className="form-floating  mb-3">
                    <input type="email" className="form-control" id="nldEmail" placeholder="New Email"
                        onChange={(e) => {
                            setChangeEmailPaylaod(
                                {
                                    ...changeEmailPaylaod,
                                    newEmail: e.target.value
                                }
                            )
                        }}
                    />
                    <label htmlFor="mobile">New Email</label>
                </div>
                {!loadingStatus.otpSent ? (<div className="m-1 text-end">
                    <button className='btn btn-success float-right'
                        onClick={sendOtp}
                    >
                        {
                            loadingStatus.otpLoading ? (
                                <div className="container  d-flex justify-content-center align-items-center">
                                    <PushSpinner size={30} color="white" />
                                </div>
                            ) : 'Send OTP'
                        }
                    </button>
                </div>) : null}
            </div>
            {
                loadingStatus.otpSent ?
                    (<div className="">
                        <div className="form-floating  mb-3">
                            <input type="number" className="form-control" id="otp" placeholder="OTP"
                                onChange={(e) => {
                                    setChangeEmailPaylaod(
                                        {
                                            ...changeEmailPaylaod,
                                            otp: e.target.value
                                        }
                                    )
                                }}
                            />
                            <label htmlFor="mobile">OTP</label>
                        </div>
                        <div className="container">
                            <button className='btn btn-primary w-100 rounded'
                            onClick={submitForm}
                             disabled={loadingStatus.otpSent ? false : true}>
                                {
                                    loadingStatus.formLoading ? (
                                        <div className="container  d-flex justify-content-center align-items-center">
                                            <PushSpinner size={30} color="white" />
                                        </div>
                                    ) : 'Change Mail'
                                }
                            </button>
                        </div>
                    </div>
                    ) : null
            }
        </div>) 
            : <SucessModal/>
        
    )
}

export default EmailChnageForm