import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PushSpinner } from 'react-spinners-kit';
import UserNavbar from '../components/UserNavbar';
import setPriceIcon from '../assetes/Dairy/setPrice.webp';
import api from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import getHeaders from '../api/header';
import { useTranslation } from "react-i18next"; // ✅ added

function DailyMilkCount() {
    const [loading, setLoading] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState('');
    const [shift, setShift] = useState('M');
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        date: '',
        milk_rate: '',
        milk_quantity: '',
        time: '',
        role: 'user',
    });

    const navigate = useNavigate();
    const { t } = useTranslation(); // ✅ translation hook

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('user/get-all-users/');
            const tempData = response.data?.data || [];
            setUsers(tempData);
        } catch (e) {
            toast.error(e.response?.data?.message || t("failedFetchUsers"));
        }
    };

    const handleSubmit = async () => {
        if (!selectedFarmer || !userData.date || !userData.milk_rate || !userData.milk_quantity) {
            toast.error(t("fillAllFields"));
            return;
        }
        setLoading(true);
        await api.post(
            'milk/add/',
            {
                'mobile': selectedFarmer,
                'shift': shift,
                'date': userData.date,
                'rate': userData.milk_rate,
                'quantity': userData.milk_quantity,
                getHeaders,
            }
        ).then((response) => {
            toast.success(response.data.message);
            setUserData({
                username: '',
                date: '',
                milk_rate: '',
                milk_quantity: '',
                time: '',
                role: 'user',
            });
        }).catch((err) => {
            toast.error(err.message || t("failedSubmit"));
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div>
            <UserNavbar />
            <div className="back-arrow position-absolute top-5 start-0 p-3">
                <FontAwesomeIcon icon={faArrowLeft} size="2x" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
            </div>
            <ToastContainer />
            <div className="shadow rounded m-4 p-4 d-flex flex-row">
                <div className="container">
                    <div className="container col-md-7">
                        <div className="form-floating mb-3">
                            <select
                                className="form-select"
                                id="farmerDropdown"
                                value={selectedFarmer}
                                onChange={(e) => setSelectedFarmer(e.target.value)}
                            >
                                <option value="">{t("selectFarmer")}</option>
                                {users.map((user) => (
                                    <option key={user.phone_number} value={user.phone_number}>
                                        {user.first_name} {user.last_name} ({user.role})
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="farmerDropdown">{t("selectFarmerLabel")}</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select
                                className="form-select"
                                value={shift}
                                onChange={(e) => setShift(e.target.value)}
                            >
                                <option value="M">{t("morning")}</option>
                                <option value="E">{t("evening")}</option>
                            </select>
                            <label htmlFor="farmerDropdown">{t("selectShift")}</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="date"
                                className="form-control"
                                value={userData.date}
                                onChange={(e) => setUserData({ ...userData, date: e.target.value })}
                            />
                            <label htmlFor="date">{t("dateLabel")}</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder={t("milkRatePlaceholder")}
                                value={userData.milk_rate}
                                onChange={(e) => setUserData({ ...userData, milk_rate: e.target.value })}
                            />
                            <label htmlFor="milkRate">{t("milkRateLabel")}</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder={t("milkLitersPlaceholder")}
                                value={userData.milk_quantity}
                                onChange={(e) => setUserData({ ...userData, milk_quantity: e.target.value })}
                            />
                            <label htmlFor="milkQuantity">{t("milkLitersLabel")}</label>
                        </div>

                        <div className="text-center my-2">
                            <button
                                id="submitButton"
                                className="btn btn-success w-75 text-center"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="container d-flex justify-content-center align-items-center">
                                        <PushSpinner size={30} color="white" />
                                    </div>
                                ) : (
                                    t("addDataBtn")
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <img id="signUpImage" src={setPriceIcon} className="img-fluid" alt="Set Price Background" />
                </div>
            </div>
        </div>
    );
}

export default DailyMilkCount;
