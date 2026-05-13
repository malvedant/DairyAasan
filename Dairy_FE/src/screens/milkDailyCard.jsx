import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import UserNavbar from '../components/UserNavbar';
import MilkStatusCard from '../components/milkStatusCard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function MilkDailyCard() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState('');

    const navigate=useNavigate();

    const fetchData = async (selectedDate) => {
        try {
            const response = await api.get(`milk/get/${selectedDate}/`, {
                // data: {
                //     date: selectedDate, 
                // },
            });
            const tempData = response.data?.data || [];
            setData(tempData);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to fetch users.');
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
        setDate(today);
        fetchData(today); // Fetch data for today's date initially
    }, []);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value.trim();
        setDate(selectedDate);
        fetchData(selectedDate); // Fetch data whenever the date changes
    };

    return (
        <div>
            <UserNavbar />
            <div className="back-arrow position-absolute top-5 start-0 p-3">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        </div>
            <div className="container p-4">
                <div className="container ">
                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            className="form-control"
                            id="lName"
                            placeholder="Date"
                            value={date} // Set the value to the current date state
                            onChange={handleDateChange} // Call handleDateChange on date change
                        />
                        <label htmlFor="lName">Date</label>
                    </div>
                </div>
                <div className="container d-flex flex-column">
                    {data.map((item, index) => (
                        <MilkStatusCard
                            key={index}
                            date={item.date}
                            shift={item.shift}
                            rate={item.milk_rate}
                            liter={item.milk_quantity}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}

export default MilkDailyCard;
