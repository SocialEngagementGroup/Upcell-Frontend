import axios from "axios";
import { trackAnalyticsEvent } from "./analytics";

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

axiosInstance.interceptors.response.use((response) => response, (error) => {
    const requestUrl = error?.config?.url || "";
    const isAnalyticsRequest = typeof requestUrl === 'string' && requestUrl.includes('analytics-events');
    const isAdminRoute = window.location.pathname.startsWith('/admin-secret');

    if (isAdminRoute && !isAnalyticsRequest) {
        trackAnalyticsEvent({
            category: 'admin_api_error',
            name: 'admin_request_failed',
            status: 'error',
            message: error?.response?.data?.error || error?.message || 'Admin request failed',
            metadata: {
                method: error?.config?.method || 'get',
                url: requestUrl,
                statusCode: error?.response?.status || null,
            },
        });
    }

    return Promise.reject(error);
});

export default axiosInstance
