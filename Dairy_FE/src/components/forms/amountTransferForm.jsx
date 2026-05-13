import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import api from '../../api/api'
import { toast } from 'react-toastify'
import getHeaders from '../../api/header'
import { PushSpinner } from 'react-spinners-kit'
import SucessModal from '../modals/sucessModal'

function AmountTransferForm({ receiverData ,visiblePin,setVisiblePin}) {
    //visiblePin={visiblePin} setVisiblePin={setVisiblePin}
    const [transferAmountPayload, setTransferAmountPayload] = useState({
        mobileNumber: receiverData.mobileNumber,
        amount: "",
        mPin: ""
    })
    const [loading, setLoading] = useState(false)
    const [showSucess, setShowSucess] = useState(false)
    const transferAmount=()=>{
        setLoading(true);
        const apiUrl = 'account/credit_amount_to_another_acoount/';
        api.post(
            apiUrl,
            {
                mobile: transferAmountPayload.mobileNumber,
                amount:transferAmountPayload.amount,
                m_pin:transferAmountPayload.mPin,
                recieverMobileNumber:transferAmountPayload.mobileNumber,
                getHeaders,
            }
        ).  
            then((response) => {
                toast.success(response.data.message);
                //setVisiblePin(false)
                setShowSucess(true)
                setTimeout(() => {
                    setVisiblePin(false)
                }, 3000);
            }).
            catch((error) => {
                toast.error(error.response.data.message);
            }).finally(() => {
                setLoading(false);
            })
    }
    return (
        <div className="container">
            <SucessModal visiblePin={showSucess} setVisiblePin={setShowSucess} />
            <div className="container">
                <div className="form-floating  mb-3">
                    <input type="number" className="form-control" id="mobile" placeholder="Mobile Number"
                        readOnly={true} value={receiverData.mobileNumber}
                    />
                    <label htmlFor="mobile">Reciever's Mobile Number</label>
                </div>
                <div className="form-floating  mb-3">
                    <input type="number" className="form-control" id="amount" placeholder="Amount"
                        onChange={(e) =>
                            setTransferAmountPayload({ ...transferAmountPayload, amount: e.target.value.trim() })
                        }
                    />
                    <label htmlFor="mobile">Amount to transfer</label>
                </div>
                <div className="form-floating  mb-3">
                    <input type="number" className="form-control" id="mpin" placeholder="M-pin"
                        onChange={(e) =>
                            setTransferAmountPayload({ ...transferAmountPayload, mPin: e.target.value.trim() })
                        }
                    />
                    <label htmlFor="mobile">M-pin</label>
                </div>
                <div className="border container rounded mb-3">
                    <p className='p-0 m-1 '> <strong>Reciever's Name</strong>:  {receiverData.firstName}</p>
                    <p className='p-0 m-1 '><strong>Reciever's Bank Name</strong>:  {receiverData.bankName}</p>
                    <p className='p-0 m-1 '><strong>Reciever's Mobile Number</strong>:  {receiverData.mobileNumber}</p>
                    <p className='p-0 m-1 '><strong>Reciever's Amount To Transfer</strong>:  {transferAmountPayload.amount}</p>
                </div>
                <div className="text-center">
                    <button id="signupButton" className="btn mx-auto btn-success w-75 text-center" onClick={transferAmount}>
                        {
                            loading ? (
                                <div className="container  d-flex justify-content-center align-items-center">
                                <PushSpinner size={30} color="white" />
                                </div>
                            ) : <p>Make Transaction <FontAwesomeIcon icon={faArrowRightLong} /></p>
                        }   
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AmountTransferForm