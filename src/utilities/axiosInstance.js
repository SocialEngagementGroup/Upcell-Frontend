import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/"
})

// Authentication Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    // Firebase Auth has been removed.
    // Implement your new authentication token logic here.
    
    /* Example:
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    */
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance