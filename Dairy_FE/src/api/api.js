import axios from 'axios';
import { useSelector } from 'react-redux';

const api = axios.create({
    // baseURL: 'Update PROD Url',
    baseURL:'http://localhost:8000/',
 });



api.interceptors.request.use((req) => {
    const cookies = document.cookie.split(';');
    let token = null;

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
            token = value;
            break;
        }
    }
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    return req
})

export default api