import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
import getHeaders from '../../api/header';
import api from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import { PushSpinner } from 'react-spinners-kit';

function ShowBankBalance({ visiblePin, setVisiblePin ,balance,setBalance }) {
    const [oldMpin, setOldMpin] = useState('')
    const [loading, setLoading] = useState(false)
    const submitForm = () => {
        setLoading(true);
        const apiUrl = 'account/check_balance/';
        api.post(
            apiUrl,
            {
                mPin: oldMpin,
                getHeaders,
            }
        ).
            then((response) => {
                toast.success("Successfully Fetched Bank Balance");
                setBalance(response.data.message)
                setVisiblePin(false)
            }).
            catch((error) => {
                console.log(error)
                toast.error(error.response.data.message);
            }).finally(() => {
                setLoading(false);
            })
    }
    return (
        <div >
          
            <CModal
                visible={visiblePin}
                alignment="center"
                onClose={() => setVisiblePin(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalBody>
                    <div className="container">
                        <div className="form-floating  mb-3">
                            <input type="text" className="form-control" id="fName" placeholder="M-pin"
                                onChange={(e) =>
                                    setOldMpin(e.target.value.trim())
                                }
                            />
                            <label htmlFor="mPin">Enter M-Pin</label>
                        </div>
                        <div className="container card">
                                <h4>Available Balance:</h4>
                                <h3>{balance}</h3>
                        </div>
                        <div className="text-center mt-4">
                            <button id="signupButton" className="btn btn-primary w-75 text-center" onClick={submitForm}>
                                {
                                    loading ? (
                                        <div className="container  d-flex justify-content-center align-items-center">
                                            <PushSpinner size={30} color="white" />
                                        </div>
                                    ) : 'Show Balance'
                                }
                            </button>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisiblePin(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default ShowBankBalance