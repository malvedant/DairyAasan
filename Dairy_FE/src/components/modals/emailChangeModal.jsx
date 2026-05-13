import React from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
    CHeader,
} from '@coreui/react';

import {EmailChnageForm} from '../forms/index'
import { ToastContainer } from 'react-toastify';

function EmailChangeForm({ visiblePin, setVisiblePin }) {
   
    // const submitForm = () => {
    //     setLoading(true);
    //     const apiUrl = 'user/verify_mail/';
    //     api.post(
    //         apiUrl,
    //         {
    //             email: email,
    //             otp: otp,
    //             getHeaders,
    //         }
    //     ).
    //         then((response) => {
    //             toast.success(response.data.message);
    //             console.log(response.data.data)
    //             dispatch(addUser(response.data.data))
    //             console.log(response.data.data)
    //             localStorage.setItem('userData',JSON.stringify(response.data.data));
    //             navigate('/user')
    //         }).
    //         catch((error) => {
    //             toast.error(error.response.data.message);
    //         }).finally(() => {
    //             setLoading(false);
    //         })
    // }
    // const sendOtpForm=()=>{
    //     setSendOtploading(true);
    //     const apiUrl = 'user/send_otp/';
    //     api.post(
    //         apiUrl,
    //         {
    //             email: email,
    //             getHeaders,
    //         }
    //     ).
    //         then((response) => {
    //             toast.success(response.data.message);
    //             setSendOtp(true)
    //         }).
    //         catch((error) => {
    //             console.log(error)
    //             toast.error(error.response.data.message);
    //         }).finally(() => {
    //             setSendOtploading(false);
    //         })
    // }
    return (
        <div >
            <ToastContainer />
            <CModal
                visible={visiblePin}
                alignment="center"
                onClose={() => setVisiblePin(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalBody>
                    <div className="container">
                        <EmailChnageForm/>
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

export default EmailChangeForm