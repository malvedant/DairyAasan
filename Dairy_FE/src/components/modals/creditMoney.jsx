import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
import getHeaders from '../../api/header';
import api from '../../api/api';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { PushSpinner } from 'react-spinners-kit';
import AmountTransferForm from '../forms/amountTransferForm';

function CreditMoney({ visiblePin, setVisiblePin }) {
    const [mobileNumber, setMobileNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [showData, setShowData] = useState(false)
    const [showTransactionPage, setShowTransactionPage] = useState(false)
    const [receiverData, setReceiverData] = useState({
        firstName: '',
        bankName: ' ',
        mobileNumber: ''
    });
    
    const submitForm = () => {
        setLoading(true);
        const apiUrl = 'account/reciever_data/';
        api.post(
            apiUrl,
            {
                mobile: mobileNumber,
                getHeaders,
            }
        ).
            then((response) => {
                console.log(response)
                setReceiverData({...receiverData,firstName: response.data.data.name,bankName:response.data.data.bankName,mobileNumber:response.data.data.mobile})
                console.log(receiverData)
                setShowData(true)
                toast.success(response.data.message);
            }).
            catch((error) => {
                setShowData(false)
                toast.error(error.response.data.message);
            }).finally(() => {
                setLoading(false);
            })
    }
    return (
        <div >
            <ToastContainer />
            <CModal
                visible={visiblePin}
                alignment="center"
                onClose={() => {
                    setVisiblePin(false)
                    setReceiverData({...receiverData,firstName:"",bankName:"",mobileNumber:""})
                    setShowData(false)
                    setShowTransactionPage(false)
                }}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalBody>
                    { !showTransactionPage ?
                    (<div className="container ">
                        <div className="form-floating  mb-3">
                            <input type="number" className="form-control" id="mobile" placeholder="Mobile Number"
                                onChange={(e) =>
                                    setMobileNumber(e.target.value.trim())
                                }
                            />
                            <label htmlFor="mobile">Check Reciever's Mobile Number</label>
                        </div>
                        {showData? (
                            <div className="border container rounded mb-3">
                                <p className='p-0 m-1 '> <strong>Name</strong>:  {receiverData.firstName}</p>
                                <p className='p-0 m-1 '><strong>Bank Name</strong>:  {receiverData.bankName}</p>
                                <p className='p-0 m-1 '><strong>Mobile Number</strong>:  {receiverData.mobileNumber}</p>
                            </div>
                        ):
                        (
                            <div className='container '>
                                {/* <p className='text-cneter text-danger'>User Data Not Found!</p> */}
                            </div>
                        )}
                        <div className="text-center mt-4">
                        <button id="signupButton" className="btn btn-primary w-75 text-center" onClick={()=>{
                            if(showData){
                                setShowTransactionPage(true);
                            }
                            else{
                                submitForm()
                            }
                            
                        }}>
                            {
                                loading ? (
                                    <div className="container d-flex justify-content-center align-items-center">
                                        <PushSpinner size={30} color="white" />
                                    </div>
                                ) : (
                                    !showData ? (
                                        <p className='text-center'>
                                            Check Account info <FontAwesomeIcon icon={faArrowRightLong} />
                                        </p>
                                    ) : (
                                        <p className='text-center'>Make Transaction <FontAwesomeIcon icon={faArrowRightLong} /></p>
                                    )
                                )
                            }
                        </button>
                        </div>
                    </div>
                    ):
                    <AmountTransferForm receiverData={receiverData} visiblePin={visiblePin} setVisiblePin={setVisiblePin}/>
                }
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => {
                        setVisiblePin(false);
                        setReceiverData({...receiverData,firstName:"",bankName:"",mobileNumber:""})
                        setShowData(false)
                        setShowTransactionPage(false)
                    }}>
                        Cancle Transaction
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default CreditMoney