import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
import getHeaders from '../../api/header';
import api from '../../api/api';
import {  toast } from 'react-toastify';
import { PushSpinner } from 'react-spinners-kit';

function UpdateMpin({ visiblePin, setVisiblePin }) {
    const [oldMpin, setOldMpin] = useState('')
    const [newMpin, setNewMpin] = useState('')
    const [loading, setLoading] = useState(false)
    const submitForm = () => {
        setLoading(true);
        const apiUrl = 'user/update_mpin/';
        api.post(
            apiUrl,
            {
                oldMpin: oldMpin,
                newMpin: newMpin,
                getHeaders,
            }
        ).
            then((response) => {
                toast.success(response.data.message);
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
                            <label htmlFor="fName">Old M-Pin</label>
                        </div>
                        <div className="form-floating  mb-3">
                            <input type="text" className="form-control" id="fName" placeholder="M-pin"
                                onChange={(e) =>
                                    setNewMpin(e.target.value.trim())
                                }
                            />
                            <label htmlFor="fName">New M-Pin</label>
                        </div>
                        <div className="text-center mt-4">
                            <button id="signupButton" className="btn btn-primary w-75 text-center" onClick={submitForm}>
                                {
                                    loading ? (
                                        <div className="container  d-flex justify-content-center align-items-center">
                                            <PushSpinner size={30} color="white" />
                                        </div>
                                    ) : 'Update M-pin'
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

export default UpdateMpin