import React, { useContext, useState } from 'react';
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { PushSpinner } from 'react-spinners-kit';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function MobileLogin({ visiblePin, setVisiblePin }) {
    const { t } = useTranslation(); // Translation hook
    const { backendUrl, setToken, getUserData, getFarmersData,getCowFeedDetails,getAllAdvancePayment} = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendOtploading, setSendOtploading] = useState(false);
    const [sendOtp, setSendOtp] = useState(false);
    const navigate = useNavigate();

    const submitForm = async () => {
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });

            if (data.success) {
                toast.success(data.message);
                localStorage.setItem("authToken",data.token);
                await getUserData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t("error_try_again"));
        } finally {
            setLoading(false);
        }
    };

    const sendOtpForm = async () => {
        setSendOtploading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { email });

            if (data.success) {
                toast.success(data.message);
                setSendOtp(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t("error_try_again"));
        } finally {
            setSendOtploading(false);
        }
    };

    return (
        <div>
            <ToastContainer />
            <CModal
                visible={visiblePin}
                alignment="center"
                onClose={() => setVisiblePin(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalBody>
                    <div className="container">
                        <div className="d-flex flex-column">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder={t("email")}
                                    readOnly={sendOtp}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                />
                                <label>{t("email")}</label>
                            </div>
                            <button
                                className="btn btn-success align-self-end my-1"
                                disabled={sendOtp}
                                onClick={sendOtpForm}
                            >
                                {sendOtploading ? <PushSpinner size={30} color="white" /> : t("send_otp")}
                            </button>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t("otp")}
                                readOnly={!sendOtp}
                                onChange={(e) => setOtp(e.target.value.trim())}
                            />
                            <label>{t("otp")}</label>
                        </div>
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-primary w-75 text-center"
                                disabled={!sendOtp}
                                onClick={submitForm}
                            >
                                {loading ? <PushSpinner size={30} color="white" /> : t("login")}
                            </button>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisiblePin(false)}>
                        {t("close")}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
}

export default MobileLogin;
