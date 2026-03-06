import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`API RESPONSE [${response.config.url}]:`, response.data);
        return response;
    },
    (error) => {
        console.error(`API ERROR [${error.config?.url}]:`, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
